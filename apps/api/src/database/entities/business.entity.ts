import { Column, Entity, Index, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { BaseEntity } from './base.entity';
import { NumericTransformer } from '../../shared/types/numeric.transformer';
import { SubscriptionTier } from '../../shared/types/enums';
import { Category } from './category.entity';
import { City } from './city.entity';
import { Area } from './area.entity';
import { User } from './user.entity';
import { Product } from './product.entity';
import { Review } from './review.entity';

@Entity('businesses')
export class Business extends BaseEntity {
  @Column({ type: 'varchar', length: 160 })
  name!: string;

  // Deprecated free-text columns — kept for transition; new code reads
  // city_id / area_id. Backfilled by the Locations migration where possible.
  @Column({ type: 'varchar', length: 160, nullable: true })
  area!: string | null;

  @Column({ type: 'varchar', length: 120, nullable: true })
  city!: string | null;

  // City / Area relations — plain *_id columns, no FK enforced.
  @ManyToOne(() => City, { createForeignKeyConstraints: false, nullable: true })
  @JoinColumn({ name: 'city_id' })
  cityRef!: City | null;

  @Index()
  @Column({ name: 'city_id', type: 'uuid', nullable: true })
  cityId!: string | null;

  @ManyToOne(() => Area, { createForeignKeyConstraints: false, nullable: true })
  @JoinColumn({ name: 'area_id' })
  areaRef!: Area | null;

  @Index()
  @Column({ name: 'area_id', type: 'uuid', nullable: true })
  areaId!: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  address!: string | null;

  // lat/lng: NUMERIC(9,6) handles ~10cm precision worldwide
  @Column({
    type: 'numeric',
    precision: 9,
    scale: 6,
    nullable: true,
    transformer: new NumericTransformer(),
  })
  latitude!: number | null;

  @Column({
    type: 'numeric',
    precision: 9,
    scale: 6,
    nullable: true,
    transformer: new NumericTransformer(),
  })
  longitude!: number | null;

  @Column({ type: 'varchar', length: 32, nullable: true })
  phone!: string | null;

  @Column({ name: 'logo_url', type: 'varchar', length: 500, nullable: true })
  logoUrl!: string | null;

  @Column({ name: 'cover_url', type: 'varchar', length: 500, nullable: true })
  coverUrl!: string | null;

  @Column({ type: 'text', nullable: true })
  description!: string | null;

  @Column({ name: 'is_verified', type: 'boolean', default: false })
  isVerified!: boolean;

  @Column({
    name: 'subscription_tier',
    type: 'enum',
    enum: SubscriptionTier,
    default: SubscriptionTier.BASIC,
  })
  subscriptionTier!: SubscriptionTier;

  // denormalised rating summary, kept in sync by ReviewService
  @Column({ name: 'rating_avg', type: 'real', default: 0 })
  ratingAvg!: number;

  @Column({ name: 'review_count', type: 'int', default: 0 })
  reviewCount!: number;

  // category relation — plain *_id column, no FK enforced (TypeORM still maps it)
  @ManyToOne(() => Category, (category) => category.businesses, {
    createForeignKeyConstraints: false,
  })
  @JoinColumn({ name: 'category_id' })
  category!: Category;

  @Index()
  @Column({ name: 'category_id', type: 'uuid' })
  categoryId!: string;

  // ownership = Aswaq's version of tenant scoping
  @ManyToOne(() => User, (user) => user.businesses, {
    createForeignKeyConstraints: false,
  })
  @JoinColumn({ name: 'owner_id' })
  owner!: User;

  @Index()
  @Column({ name: 'owner_id', type: 'uuid' })
  ownerId!: string;

  @OneToMany(() => Product, (product) => product.business)
  products!: Product[];

  @OneToMany(() => Review, (review) => review.business)
  reviews!: Review[];
}
