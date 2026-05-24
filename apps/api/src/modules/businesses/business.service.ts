import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Business } from '../../database/entities/business.entity';
import { City } from '../../database/entities/city.entity';
import { Area } from '../../database/entities/area.entity';
import { BaseRepository } from '../../shared/repo/base.repo';
import { Paginated } from '../../shared/dto/pagination.dto';
import { AuthUser } from '../../shared/decorators/current-user.decorator';
import { UserRole } from '../../shared/types/enums';
import { CreateBusinessDto } from './dto/create-business.dto';
import { UpdateBusinessDto } from './dto/update-business.dto';
import { FindBusinessDto } from './dto/find-business.dto';

@Injectable()
export class BusinessService extends BaseRepository {
  constructor(
    @InjectRepository(Business) private readonly repo: Repository<Business>,
    @InjectRepository(City) private readonly cityRepo: Repository<City>,
    @InjectRepository(Area) private readonly areaRepo: Repository<Area>,
  ) {
    super();
  }

  async findAll(dto: FindBusinessDto): Promise<Paginated<Business>> {
    const qb = this.repo.createQueryBuilder('b');
    if (dto.categoryId)
      qb.andWhere('b.categoryId = :categoryId', { categoryId: dto.categoryId });
    if (dto.cityId) qb.andWhere('b.cityId = :cityId', { cityId: dto.cityId });
    if (dto.areaId) qb.andWhere('b.areaId = :areaId', { areaId: dto.areaId });

    return this.paginate(qb, dto, {
      alias: 'b',
      // Free-text city/area columns are deprecated but still around during
      // transition and stay searchable so legacy rows without city_id/area_id
      // still surface in keyword search results.
      searchable: ['b.name', 'b.area', 'b.city'],
      allowedSort: ['createdAt', 'ratingAvg', 'reviewCount', 'name'],
      defaultSort: 'ratingAvg',
    });
  }

  async findOne(id: string): Promise<Business> {
    const business = await this.repo.findOne({
      where: { id },
      relations: { products: true, category: true },
    });
    if (!business) throw new NotFoundException('Business not found');
    return business;
  }

  async create(dto: CreateBusinessDto, user: AuthUser): Promise<Business> {
    const business = this.repo.create({ ...dto, ownerId: user.sub });
    await this.mirrorLocationText(business);
    return this.repo.save(business);
  }

  async update(id: string, dto: UpdateBusinessDto, user: AuthUser): Promise<Business> {
    const business = await this.findOne(id);
    this.assertOwner(business, user);
    Object.assign(business, dto);
    await this.mirrorLocationText(business);
    return this.repo.save(business);
  }

  // Keep the deprecated free-text city/area columns aligned with the
  // city_id/area_id selections, so legacy readers (and the search-tokenisation
  // path that still indexes those columns) see consistent values.
  private async mirrorLocationText(business: Business): Promise<void> {
    if (business.cityId) {
      const city = await this.cityRepo.findOne({ where: { id: business.cityId } });
      if (!city) throw new NotFoundException('City not found');
      business.city = city.name;
    } else {
      business.city = null;
    }
    if (business.areaId) {
      const area = await this.areaRepo.findOne({ where: { id: business.areaId } });
      if (!area) throw new NotFoundException('Area not found');
      if (business.cityId && area.cityId !== business.cityId) {
        throw new ForbiddenException('Area does not belong to that city');
      }
      business.area = area.name;
    } else {
      business.area = null;
    }
  }

  async remove(id: string, user: AuthUser): Promise<{ id: string }> {
    const business = await this.findOne(id);
    this.assertOwner(business, user);
    await this.repo.softDelete(id);
    return { id };
  }

  // ownership scoping = Aswaq's version of Safeer's tenant scoping
  private assertOwner(business: Business, user: AuthUser) {
    if (user.role !== UserRole.ADMIN && business.ownerId !== user.sub) {
      throw new ForbiddenException('You do not own this business');
    }
  }
}
