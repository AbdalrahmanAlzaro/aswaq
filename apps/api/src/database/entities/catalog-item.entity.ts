import { Column, Entity, Index, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { BaseEntity } from './base.entity';
import { Category } from './category.entity';
import { Product } from './product.entity';

// Canonical, brand+unit-specific item that multiple sellers can offer (e.g.
// "Rice 5kg — Abu Kass" stocked by Carrefour, Sameh Mall, Cozmo). Standardised
// goods point at a CatalogItem so the cross-market price view can aggregate
// offers; unique items (a cafe's signature dish) leave the link null.
@Entity('catalog_items')
export class CatalogItem extends BaseEntity {
  @Column({ type: 'varchar', length: 160 })
  name!: string;

  @Column({ name: 'name_ar', type: 'varchar', length: 160, nullable: true })
  nameAr!: string | null;

  // category relation — plain *_id column, no FK enforced (TypeORM still maps it)
  @ManyToOne(() => Category, { createForeignKeyConstraints: false })
  @JoinColumn({ name: 'category_id' })
  category!: Category;

  @Index()
  @Column({ name: 'category_id', type: 'uuid' })
  categoryId!: string;

  // human-readable unit / pack size, e.g. "5 kg", "500 ml", "12-pack"
  @Column({ type: 'varchar', length: 60 })
  unit!: string;

  @Column({ type: 'varchar', length: 120, nullable: true })
  brand!: string | null;

  @Column({ name: 'image_url', type: 'varchar', length: 500, nullable: true })
  imageUrl!: string | null;

  @OneToMany(() => Product, (product) => product.catalogItem)
  products!: Product[];
}
