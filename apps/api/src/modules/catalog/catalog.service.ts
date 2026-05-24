import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { CatalogItem } from '../../database/entities/catalog-item.entity';
import { Product } from '../../database/entities/product.entity';
import { Business } from '../../database/entities/business.entity';
import { Paginated } from '../../shared/dto/pagination.dto';
import { CreateCatalogItemDto } from './dto/create-catalog-item.dto';
import { FindCatalogDto } from './dto/find-catalog.dto';

export interface CatalogItemListView extends CatalogItem {
  lowestPrice: number | null;
  sellerCount: number;
}

export interface CatalogOffer {
  id: string;
  name: string;
  price: number;
  currency: string;
  isAvailable: boolean;
  imageUrl: string | null;
  isCheapest: boolean;
  // Per-product rating summary (denormalised on Product; refreshed by the
  // Review service whenever a product-scoped review lands).
  ratingAvg: number;
  reviewCount: number;
  business: {
    id: string;
    name: string;
    ratingAvg: number;
    area: string | null;
    city: string | null;
  };
}

@Injectable()
export class CatalogService {
  constructor(
    @InjectRepository(CatalogItem)
    private readonly repo: Repository<CatalogItem>,
    private readonly dataSource: DataSource,
  ) {}

  // Aggregated catalog search: each row carries the MIN(price) across all
  // sellers and the seller count. Pagination + aggregates don't compose with
  // the BaseRepository.paginate helper, so the COUNT and the page are run as
  // two queries.
  async findAll(dto: FindCatalogDto): Promise<Paginated<CatalogItemListView>> {
    const page = dto.page ?? 1;
    const perPage = dto.perPage ?? 20;
    const sortBy = ['name', 'createdAt', 'lowestPrice'].includes(dto.sortBy ?? '')
      ? dto.sortBy!
      : 'name';
    const sortOrder = dto.sortOrder ?? 'ASC';

    const filters: string[] = ['ci.deleted_at IS NULL'];
    const params: Record<string, unknown> = {};
    if (dto.search) {
      filters.push(
        '(ci.name ILIKE :search OR ci.name_ar ILIKE :search OR ci.brand ILIKE :search)',
      );
      params.search = `%${dto.search}%`;
    }
    if (dto.categoryId) {
      filters.push('ci.category_id = :categoryId');
      params.categoryId = dto.categoryId;
    }
    const whereClause = filters.join(' AND ');

    const cityJoinOn = dto.cityId
      ? 'b.id = p.business_id AND b.deleted_at IS NULL AND b.city_id = :cityId'
      : 'b.id = p.business_id AND b.deleted_at IS NULL';
    if (dto.cityId) params.cityId = dto.cityId;

    // Count of distinct catalog_items matching the filter set (city filter
    // shrinks the set via HAVING when applied).
    const countQb = this.repo
      .createQueryBuilder('ci')
      .select('COUNT(DISTINCT ci.id)', 'cnt')
      .leftJoin('products', 'p', 'p.catalog_item_id = ci.id AND p.deleted_at IS NULL')
      .leftJoin('businesses', 'b', cityJoinOn)
      .where(whereClause, params);
    if (dto.cityId) {
      // Only count catalog items that have at least one matching-city offer.
      const cityCountSub = this.repo
        .createQueryBuilder('ci')
        .select('ci.id', 'id')
        .leftJoin('products', 'p', 'p.catalog_item_id = ci.id AND p.deleted_at IS NULL')
        .leftJoin('businesses', 'b', cityJoinOn)
        .where(whereClause, params)
        .groupBy('ci.id')
        .having('COUNT(b.id) > 0');
      const matches = await cityCountSub.getRawMany<{ id: string }>();
      return this.fetchPage(
        matches.map((m) => m.id),
        sortBy,
        sortOrder,
        page,
        perPage,
        dto.cityId,
      );
    }
    const total = parseInt((await countQb.getRawOne<{ cnt: string }>())?.cnt ?? '0', 10);

    // Page query: select the catalog item with MIN(price) + seller count.
    const orderColumn =
      sortBy === 'lowestPrice'
        ? 'lowest_price'
        : sortBy === 'createdAt'
          ? 'ci.created_at'
          : 'ci.name';

    const rows = await this.repo
      .createQueryBuilder('ci')
      .leftJoin('products', 'p', 'p.catalog_item_id = ci.id AND p.deleted_at IS NULL')
      .leftJoin('businesses', 'b', cityJoinOn)
      .addSelect('MIN(p.price)', 'lowest_price')
      .addSelect('COUNT(DISTINCT p.business_id)', 'seller_count')
      .where(whereClause, params)
      .groupBy('ci.id')
      .orderBy(orderColumn, sortOrder, sortBy === 'lowestPrice' ? 'NULLS LAST' : undefined)
      .offset((page - 1) * perPage)
      .limit(perPage)
      .getRawAndEntities();

    const items: CatalogItemListView[] = rows.entities.map((entity, i) => {
      const raw = rows.raw[i] as { lowest_price: string | null; seller_count: string };
      return Object.assign(entity, {
        lowestPrice: raw.lowest_price === null ? null : parseFloat(raw.lowest_price),
        sellerCount: parseInt(raw.seller_count, 10),
      });
    });

    return {
      items,
      meta: { page, perPage, total, pageCount: Math.ceil(total / perPage) || 1 },
    };
  }

  // Called when a `cityId` filter is present — we know which catalog_item ids
  // qualify, now we just need their detail row + per-city aggregate.
  private async fetchPage(
    ids: string[],
    sortBy: string,
    sortOrder: 'ASC' | 'DESC',
    page: number,
    perPage: number,
    cityId: string,
  ): Promise<Paginated<CatalogItemListView>> {
    const total = ids.length;
    if (total === 0) {
      return {
        items: [],
        meta: { page, perPage, total, pageCount: 1 },
      };
    }
    const orderColumn =
      sortBy === 'lowestPrice'
        ? 'lowest_price'
        : sortBy === 'createdAt'
          ? 'ci.created_at'
          : 'ci.name';

    const rows = await this.repo
      .createQueryBuilder('ci')
      .leftJoin('products', 'p', 'p.catalog_item_id = ci.id AND p.deleted_at IS NULL')
      .leftJoin(
        'businesses',
        'b',
        'b.id = p.business_id AND b.deleted_at IS NULL AND b.city_id = :cityId',
        { cityId },
      )
      .addSelect('MIN(p.price)', 'lowest_price')
      .addSelect('COUNT(DISTINCT p.business_id)', 'seller_count')
      .where('ci.id IN (:...ids)', { ids })
      .groupBy('ci.id')
      .orderBy(orderColumn, sortOrder, sortBy === 'lowestPrice' ? 'NULLS LAST' : undefined)
      .offset((page - 1) * perPage)
      .limit(perPage)
      .getRawAndEntities();

    const items: CatalogItemListView[] = rows.entities.map((entity, i) => {
      const raw = rows.raw[i] as { lowest_price: string | null; seller_count: string };
      return Object.assign(entity, {
        lowestPrice: raw.lowest_price === null ? null : parseFloat(raw.lowest_price),
        sellerCount: parseInt(raw.seller_count, 10),
      });
    });
    return {
      items,
      meta: { page, perPage, total, pageCount: Math.ceil(total / perPage) || 1 },
    };
  }

  async findOne(id: string): Promise<CatalogItem> {
    const item = await this.repo.findOne({
      where: { id },
      relations: { category: true },
    });
    if (!item) throw new NotFoundException('Catalog item not found');
    return item;
  }

  // Every seller's offer for the item, ascending by price. Marks `isCheapest`
  // on the lowest-priced row (handles ties — multiple `isCheapest=true` if
  // the bottom price is shared).
  async findOffers(id: string): Promise<CatalogOffer[]> {
    await this.findOne(id); // 404 if the catalog item doesn't exist
    const products = await this.dataSource
      .getRepository(Product)
      .createQueryBuilder('p')
      .leftJoinAndSelect('p.business', 'b')
      .where('p.catalogItemId = :id', { id })
      .andWhere('p.deletedAt IS NULL')
      .orderBy('p.price', 'ASC')
      .getMany();

    if (products.length === 0) return [];
    const minPrice = products[0].price;
    return products.map((p) => ({
      id: p.id,
      name: p.name,
      price: p.price,
      currency: p.currency,
      isAvailable: p.isAvailable,
      imageUrl: p.imageUrl,
      isCheapest: p.price === minPrice,
      ratingAvg: p.ratingAvg,
      reviewCount: p.reviewCount,
      business: {
        id: p.business.id,
        name: p.business.name,
        ratingAvg: p.business.ratingAvg,
        area: p.business.area,
        city: p.business.city,
      },
    }));
  }

  create(dto: CreateCatalogItemDto): Promise<CatalogItem> {
    return this.repo.save(this.repo.create(dto));
  }
}
