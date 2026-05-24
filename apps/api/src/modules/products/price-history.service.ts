import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PriceHistory } from '../../database/entities/price-history.entity';
import { Product } from '../../database/entities/product.entity';

@Injectable()
export class PriceHistoryService {
  constructor(
    @InjectRepository(PriceHistory) private readonly repo: Repository<PriceHistory>,
    @InjectRepository(Product) private readonly productRepo: Repository<Product>,
  ) {}

  async findByProduct(productId: string): Promise<PriceHistory[]> {
    const product = await this.productRepo.findOne({ where: { id: productId } });
    if (!product) throw new NotFoundException('Product not found');
    return this.repo.find({
      where: { productId },
      order: { recordedAt: 'DESC' },
    });
  }

  // Lowest price for a product over the last N days; returns null if no rows in window.
  async lowestPriceInLastDays(productId: string, days: number): Promise<number | null> {
    const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
    const row = await this.repo
      .createQueryBuilder('ph')
      .select('MIN(ph.price)', 'min')
      .where('ph.productId = :productId', { productId })
      .andWhere('ph.recordedAt >= :since', { since })
      .getRawOne<{ min: string | null }>();
    return row?.min !== null && row?.min !== undefined ? parseFloat(row.min) : null;
  }
}
