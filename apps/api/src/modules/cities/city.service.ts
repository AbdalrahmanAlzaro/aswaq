import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { City } from '../../database/entities/city.entity';
import { Area } from '../../database/entities/area.entity';
import { CreateCityDto } from './dto/create-city.dto';
import { UpdateCityDto } from './dto/update-city.dto';
import { CreateAreaDto } from './dto/create-area.dto';
import { UpdateAreaDto } from './dto/update-area.dto';

@Injectable()
export class CityService {
  constructor(
    @InjectRepository(City) private readonly cities: Repository<City>,
    @InjectRepository(Area) private readonly areas: Repository<Area>,
  ) {}

  async findAll(search?: string): Promise<City[]> {
    const qb = this.cities
      .createQueryBuilder('c')
      .where('c.isActive = :active', { active: true });
    if (search) {
      qb.andWhere('(c.name ILIKE :q OR c.nameAr ILIKE :q)', {
        q: `%${search}%`,
      });
    }
    qb.orderBy('c.sortOrder', 'ASC').addOrderBy('c.name', 'ASC');
    return qb.getMany();
  }

  async findOne(id: string): Promise<City> {
    const city = await this.cities.findOne({ where: { id } });
    if (!city) throw new NotFoundException('City not found');
    return city;
  }

  // Areas for a city, ordered by sort_order then name. Used by the dependent
  // area dropdown on the search page and the business owner form.
  async findAreas(cityId: string): Promise<Area[]> {
    // 404 if the parent city doesn't exist
    await this.findOne(cityId);
    return this.areas.find({
      where: { cityId },
      order: { sortOrder: 'ASC', name: 'ASC' },
    });
  }

  createCity(dto: CreateCityDto): Promise<City> {
    return this.cities.save(this.cities.create(dto));
  }

  async updateCity(id: string, dto: UpdateCityDto): Promise<City> {
    const city = await this.findOne(id);
    Object.assign(city, dto);
    return this.cities.save(city);
  }

  async createArea(cityId: string, dto: CreateAreaDto): Promise<Area> {
    await this.findOne(cityId); // 404 if missing
    return this.areas.save(this.areas.create({ ...dto, cityId }));
  }

  async updateArea(cityId: string, areaId: string, dto: UpdateAreaDto): Promise<Area> {
    const area = await this.areas.findOne({ where: { id: areaId, cityId } });
    if (!area) throw new NotFoundException('Area not found');
    Object.assign(area, dto);
    return this.areas.save(area);
  }

  // Convenience helper used by the seed: case-insensitive slug → City lookup
  // bypassing the isActive filter so a temporarily-disabled city can still be
  // backfilled by an admin tool.
  findBySlug(slug: string): Promise<City | null> {
    return this.cities.findOne({ where: { slug: ILike(slug) } });
  }
}
