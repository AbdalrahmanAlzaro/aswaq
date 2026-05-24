import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryFailedError, Repository } from 'typeorm';
import { Favorite } from '../../database/entities/favorite.entity';
import { Business } from '../../database/entities/business.entity';
import { AuthUser } from '../../shared/decorators/current-user.decorator';
import { CreateFavoriteDto } from './dto/create-favorite.dto';

@Injectable()
export class FavoriteService {
  constructor(
    @InjectRepository(Favorite) private readonly repo: Repository<Favorite>,
    @InjectRepository(Business) private readonly businessRepo: Repository<Business>,
  ) {}

  list(user: AuthUser): Promise<Favorite[]> {
    return this.repo.find({
      where: { userId: user.sub },
      relations: { business: true },
      order: { createdAt: 'DESC' },
    });
  }

  async add(dto: CreateFavoriteDto, user: AuthUser): Promise<Favorite> {
    const business = await this.businessRepo.findOne({ where: { id: dto.businessId } });
    if (!business) throw new NotFoundException('Business not found');
    try {
      return await this.repo.save(
        this.repo.create({ userId: user.sub, businessId: dto.businessId }),
      );
    } catch (err) {
      // 23505 = unique_violation — the user already favorited this business
      if (err instanceof QueryFailedError && (err as { code?: string }).code === '23505') {
        throw new ConflictException('Already favorited');
      }
      throw err;
    }
  }

  async remove(businessId: string, user: AuthUser): Promise<{ businessId: string }> {
    const fav = await this.repo.findOne({
      where: { userId: user.sub, businessId },
    });
    if (!fav) throw new NotFoundException('Not in your favorites');
    await this.repo.softDelete(fav.id);
    return { businessId };
  }
}
