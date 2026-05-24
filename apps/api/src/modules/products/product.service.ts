import {
  ForbiddenException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, EntityManager, In, Repository } from 'typeorm';
import { Product } from '../../database/entities/product.entity';
import { Business } from '../../database/entities/business.entity';
import { CatalogItem } from '../../database/entities/catalog-item.entity';
import { PriceHistory } from '../../database/entities/price-history.entity';
import { AuthUser } from '../../shared/decorators/current-user.decorator';
import { UserRole } from '../../shared/types/enums';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product) private readonly repo: Repository<Product>,
    @InjectRepository(Business) private readonly businessRepo: Repository<Business>,
    private readonly dataSource: DataSource,
  ) {}

  findByBusiness(businessId: string): Promise<Product[]> {
    return this.repo.find({ where: { businessId }, order: { name: 'ASC' } });
  }

  async findOne(id: string): Promise<Product> {
    const product = await this.repo.findOne({
      where: { id },
      relations: { business: true },
    });
    if (!product) throw new NotFoundException('Product not found');
    return product;
  }

  // Compare products side by side; luxury items require a Premium shopper.
  async compare(ids: string[], user: AuthUser) {
    const products = await this.repo.find({
      where: { id: In(ids) },
      relations: { business: { category: true } },
    });
    if (!products.length) throw new NotFoundException('No products found');

    const hasLuxury = products.some((p) => p.business.category?.isLuxury === true);
    if (hasLuxury && !user.isPremium) {
      throw new HttpException(
        'Comparing luxury items requires Aswaq Premium',
        HttpStatus.PAYMENT_REQUIRED,
      );
    }

    const cheapest = Math.min(...products.map((p) => p.price));
    const topRated = Math.max(...products.map((p) => p.ratingAvg));
    return products.map((p) => ({
      id: p.id,
      name: p.name,
      price: p.price,
      ratingAvg: p.ratingAvg,
      business: {
        id: p.business.id,
        name: p.business.name,
        ratingAvg: p.business.ratingAvg,
        category: p.business.category
          ? { id: p.business.category.id, slug: p.business.category.slug, name: p.business.category.name }
          : null,
      },
      isCheapest: p.price === cheapest,
      isTopRated: p.ratingAvg === topRated && topRated > 0,
    }));
  }

  // Create the product and record an initial price_history row in the same transaction.
  // If `catalog` is supplied (and `catalogItemId` is not), a new CatalogItem is
  // created in the same transaction so this product becomes its first offer.
  async create(dto: CreateProductDto, user: AuthUser): Promise<Product> {
    await this.assertOwnsBusiness(dto.businessId, user);
    return this.dataSource.transaction(async (manager) => {
      const catalogItemId = await this.resolveCatalogItemId(manager, dto);
      const { catalog: _ignored, ...rest } = dto;
      void _ignored;
      const product = await manager.save(
        manager.create(Product, { ...rest, catalogItemId }),
      );
      await this.recordPrice(manager, product.id, product.price);
      return product;
    });
  }

  // Update the product and, if price changed, append a price_history row in the same tx.
  // catalogItemId is mutable: owners can link/unlink the canonical item.
  async update(id: string, dto: UpdateProductDto, user: AuthUser): Promise<Product> {
    const existing = await this.getOr404(id);
    await this.assertOwnsBusiness(existing.businessId, user);
    return this.dataSource.transaction(async (manager) => {
      const previousPrice = existing.price;
      const nextCatalogItemId = await this.resolveCatalogItemId(manager, dto);
      const { catalog: _ignored, ...rest } = dto;
      void _ignored;
      Object.assign(existing, rest);
      if (nextCatalogItemId !== undefined) existing.catalogItemId = nextCatalogItemId;
      const saved = await manager.save(Product, existing);
      if (dto.price !== undefined && saved.price !== previousPrice) {
        await this.recordPrice(manager, saved.id, saved.price);
      }
      return saved;
    });
  }

  // Resolves the effective catalogItemId for create/update:
  // - `catalogItemId` set → verify it exists and use it
  // - `catalog` set → create the catalog item inline, return its id
  // - neither → undefined (caller decides whether to keep the existing value)
  private async resolveCatalogItemId(
    manager: EntityManager,
    dto: CreateProductDto | UpdateProductDto,
  ): Promise<string | null | undefined> {
    if (dto.catalogItemId) {
      const exists = await manager.findOne(CatalogItem, {
        where: { id: dto.catalogItemId },
      });
      if (!exists) throw new NotFoundException('Catalog item not found');
      return dto.catalogItemId;
    }
    if (dto.catalog) {
      const created = await manager.save(manager.create(CatalogItem, dto.catalog));
      return created.id;
    }
    return undefined;
  }

  async remove(id: string, user: AuthUser): Promise<{ id: string }> {
    const product = await this.getOr404(id);
    await this.assertOwnsBusiness(product.businessId, user);
    await this.repo.softDelete(id);
    return { id };
  }

  private async getOr404(id: string): Promise<Product> {
    const product = await this.repo.findOne({ where: { id } });
    if (!product) throw new NotFoundException('Product not found');
    return product;
  }

  private async assertOwnsBusiness(businessId: string, user: AuthUser) {
    const business = await this.businessRepo.findOne({ where: { id: businessId } });
    if (!business) throw new NotFoundException('Business not found');
    if (user.role !== UserRole.ADMIN && business.ownerId !== user.sub) {
      throw new ForbiddenException('You do not own this business');
    }
  }

  private recordPrice(manager: EntityManager, productId: string, price: number): Promise<PriceHistory> {
    return manager.save(manager.create(PriceHistory, { productId, price }));
  }
}
