import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, In, Repository } from 'typeorm';
import { Media } from '../../database/entities/media.entity';
import { Business } from '../../database/entities/business.entity';
import { Product } from '../../database/entities/product.entity';
import { Review } from '../../database/entities/review.entity';
import { AuthUser } from '../../shared/decorators/current-user.decorator';
import { MediaKind, MediaOwnerType, UserRole } from '../../shared/types/enums';
import { CreateMediaDto } from './dto/create-media.dto';
import { UpdateMediaDto } from './dto/update-media.dto';
import { ReorderMediaDto } from './dto/reorder-media.dto';

@Injectable()
export class MediaService {
  constructor(
    @InjectRepository(Media) private readonly repo: Repository<Media>,
    private readonly dataSource: DataSource,
  ) {}

  findForOwner(ownerType: MediaOwnerType, ownerId: string): Promise<Media[]> {
    return this.repo.find({
      where: { ownerType, ownerId },
      order: { sortOrder: 'ASC', createdAt: 'ASC' },
    });
  }

  async create(dto: CreateMediaDto, user: AuthUser): Promise<Media> {
    await this.assertOwnsParent(dto.ownerType, dto.ownerId, user);
    return this.repo.save(
      this.repo.create({
        ownerType: dto.ownerType,
        ownerId: dto.ownerId,
        url: dto.url,
        kind: dto.kind ?? MediaKind.GALLERY,
        sortOrder: dto.sortOrder ?? 0,
        altText: dto.altText ?? null,
      }),
    );
  }

  async update(id: string, dto: UpdateMediaDto, user: AuthUser): Promise<Media> {
    const media = await this.getOr404(id);
    await this.assertOwnsParent(media.ownerType, media.ownerId, user);
    Object.assign(media, dto);
    return this.repo.save(media);
  }

  // Bulk re-order: all rows must belong to the same parent so we only auth once.
  async reorder(dto: ReorderMediaDto, user: AuthUser): Promise<{ updated: number }> {
    const ids = dto.items.map((i) => i.id);
    const rows = await this.repo.find({ where: { id: In(ids) } });
    if (rows.length !== ids.length) throw new NotFoundException('One or more media not found');

    const first = rows[0];
    if (rows.some((r) => r.ownerType !== first.ownerType || r.ownerId !== first.ownerId)) {
      throw new BadRequestException('All media must belong to the same parent');
    }
    await this.assertOwnsParent(first.ownerType, first.ownerId, user);

    return this.dataSource.transaction(async (manager) => {
      for (const { id, sortOrder } of dto.items) {
        await manager.update(Media, id, { sortOrder });
      }
      return { updated: dto.items.length };
    });
  }

  async remove(id: string, user: AuthUser): Promise<{ id: string }> {
    const media = await this.getOr404(id);
    await this.assertOwnsParent(media.ownerType, media.ownerId, user);
    await this.repo.softDelete(id);
    return { id };
  }

  private async getOr404(id: string): Promise<Media> {
    const media = await this.repo.findOne({ where: { id } });
    if (!media) throw new NotFoundException('Media not found');
    return media;
  }

  // Auth = owner of the parent business, or admin. Products and reviews are checked via
  // their parent business (a review's business_id, a product's business_id).
  private async assertOwnsParent(
    ownerType: MediaOwnerType,
    ownerId: string,
    user: AuthUser,
  ): Promise<void> {
    if (user.role === UserRole.ADMIN) return;

    const businessId = await this.resolveBusinessId(ownerType, ownerId);
    const business = await this.dataSource
      .getRepository(Business)
      .findOne({ where: { id: businessId } });
    if (!business) throw new NotFoundException('Parent business not found');
    if (business.ownerId !== user.sub) {
      throw new ForbiddenException('You do not own this business');
    }
  }

  private async resolveBusinessId(
    ownerType: MediaOwnerType,
    ownerId: string,
  ): Promise<string> {
    if (ownerType === MediaOwnerType.BUSINESS) return ownerId;
    if (ownerType === MediaOwnerType.PRODUCT) {
      const p = await this.dataSource
        .getRepository(Product)
        .findOne({ where: { id: ownerId } });
      if (!p) throw new NotFoundException('Product not found');
      return p.businessId;
    }
    // review
    const r = await this.dataSource
      .getRepository(Review)
      .findOne({ where: { id: ownerId } });
    if (!r) throw new NotFoundException('Review not found');
    return r.businessId;
  }
}
