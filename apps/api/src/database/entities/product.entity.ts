import { Column, Entity, Index, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { BaseEntity } from './base.entity';
import { NumericTransformer } from '../../shared/types/numeric.transformer';
import { Business } from './business.entity';
import { CatalogItem } from './catalog-item.entity';
import { Review } from './review.entity';

@Entity('products')
export class Product extends BaseEntity {
  @Column({ type: 'varchar', length: 160 })
  name!: string;

  @Column({ type: 'text', nullable: true })
  description!: string | null;

  @Column({ name: 'image_url', type: 'varchar', length: 500, nullable: true })
  imageUrl!: string | null;

  // money: NUMERIC(10,2), returned as a number via the transformer
  @Column({
    type: 'numeric',
    precision: 10,
    scale: 2,
    transformer: new NumericTransformer(),
  })
  price!: number;

  @Column({ type: 'varchar', length: 8, default: 'JD' })
  currency!: string;

  @Column({ name: 'is_available', type: 'boolean', default: true })
  isAvailable!: boolean;

  @Column({ name: 'rating_avg', type: 'real', default: 0 })
  ratingAvg!: number;

  @Column({ name: 'review_count', type: 'int', default: 0 })
  reviewCount!: number;

  @ManyToOne(() => Business, (business) => business.products, {
    createForeignKeyConstraints: false,
  })
  @JoinColumn({ name: 'business_id' })
  business!: Business;

  @Index()
  @Column({ name: 'business_id', type: 'uuid' })
  businessId!: string;

  // Optional link to the canonical CatalogItem. When set, this product is one
  // seller's offer for the catalog item and shows up in the cross-market price
  // comparison flow. NULL = a one-off product not cross-compared.
  @ManyToOne(() => CatalogItem, (item) => item.products, {
    createForeignKeyConstraints: false,
    nullable: true,
  })
  @JoinColumn({ name: 'catalog_item_id' })
  catalogItem!: CatalogItem | null;

  @Index()
  @Column({ name: 'catalog_item_id', type: 'uuid', nullable: true })
  catalogItemId!: string | null;

  @OneToMany(() => Review, (review) => review.product)
  reviews!: Review[];
}
