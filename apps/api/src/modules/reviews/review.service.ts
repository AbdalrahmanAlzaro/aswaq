import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, EntityManager, Repository } from 'typeorm';
import { Review } from '../../database/entities/review.entity';
import { Business } from '../../database/entities/business.entity';
import { Product } from '../../database/entities/product.entity';
import { BaseRepository } from '../../shared/repo/base.repo';
import { AuthUser } from '../../shared/decorators/current-user.decorator';
import { Paginated } from '../../shared/dto/pagination.dto';
import { CreateReviewDto } from './dto/create-review.dto';
import { FindReviewsDto } from './dto/find-reviews.dto';

@Injectable()
export class ReviewService extends BaseRepository {
  constructor(
    @InjectRepository(Review) private readonly repo: Repository<Review>,
    private readonly dataSource: DataSource,
  ) {
    super();
  }

  // Reviews for either a whole business or one of its products. The DTO
  // enforces that at least one of (businessId, productId) is set; productId
  // wins when both are present.
  async find(
    dto: FindReviewsDto,
  ): Promise<Paginated<Review & { author: string | null; verified: boolean }>> {
    // Join user.name so the UI can render the real reviewer without a second
    // round-trip. `verified` is a placeholder until verified-purchase logic
    // lands; we always return false for now.
    const qb = this.repo
      .createQueryBuilder('r')
      .leftJoinAndSelect('r.user', 'u');
    if (dto.productId) {
      qb.where('r.productId = :productId', { productId: dto.productId });
    } else {
      qb.where('r.businessId = :businessId', { businessId: dto.businessId });
    }
    const page = await this.paginate(qb, dto, {
      alias: 'r',
      allowedSort: ['createdAt', 'rating'],
      defaultSort: 'createdAt',
    });
    return {
      ...page,
      items: page.items.map((r) => {
        // Don't leak the whole user object (email, role, etc.) — just the
        // display name.
        const { user, ...rest } = r;
        return {
          ...(rest as Review),
          author: user?.name ?? null,
          verified: false,
        };
      }),
    };
  }

  // One logical operation touches 2-3 tables, so it runs in a single transaction.
  async create(dto: CreateReviewDto, user: AuthUser): Promise<Review> {
    return this.dataSource.transaction(async (manager) => {
      const business = await manager.findOne(Business, { where: { id: dto.businessId } });
      if (!business) throw new NotFoundException('Business not found');

      if (dto.productId) {
        const product = await manager.findOne(Product, { where: { id: dto.productId } });
        if (!product) throw new NotFoundException('Product not found');
        if (product.businessId !== dto.businessId) {
          throw new BadRequestException('Product does not belong to that business');
        }
      }

      const review = await manager.save(
        manager.create(Review, {
          businessId: dto.businessId,
          productId: dto.productId ?? null,
          rating: dto.rating,
          comment: dto.comment ?? null,
          userId: user.sub,
        }),
      );

      await this.refreshSummary(manager, Business, 'businessId', dto.businessId);
      if (dto.productId) {
        await this.refreshSummary(manager, Product, 'productId', dto.productId);
      }
      return review;
    });
  }

  // Recompute denormalised rating_avg / review_count for the target row.
  private async refreshSummary(
    manager: EntityManager,
    target: typeof Business | typeof Product,
    column: 'businessId' | 'productId',
    id: string,
  ) {
    const row = await manager
      .createQueryBuilder(Review, 'r')
      .select('AVG(r.rating)', 'avg')
      .addSelect('COUNT(*)', 'count')
      .where(`r.${column} = :id`, { id })
      .getRawOne<{ avg: string | null; count: string }>();

    await manager.update(target, id, {
      ratingAvg: row?.avg ? parseFloat(parseFloat(row.avg).toFixed(2)) : 0,
      reviewCount: row ? parseInt(row.count, 10) : 0,
    });
  }
}
