import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from './base.entity';
import { NumericTransformer } from '../../shared/types/numeric.transformer';
import { Product } from './product.entity';

// Append-only price log for a product. ProductService writes a row whenever a product is
// created or its price changes, inside the same transaction as the product save.
@Entity('price_history')
export class PriceHistory extends BaseEntity {
  @ManyToOne(() => Product, { createForeignKeyConstraints: false })
  @JoinColumn({ name: 'product_id' })
  product!: Product;

  @Index()
  @Column({ name: 'product_id', type: 'uuid' })
  productId!: string;

  // money: NUMERIC(10,2), returned as a number via the transformer
  @Column({
    type: 'numeric',
    precision: 10,
    scale: 2,
    transformer: new NumericTransformer(),
  })
  price!: number;

  @Index()
  @Column({ name: 'recorded_at', type: 'timestamptz', default: () => 'now()' })
  recordedAt!: Date;
}
