import { Column, Entity, Index, OneToMany } from 'typeorm';
import { BaseEntity } from './base.entity';
import { NumericTransformer } from '../../shared/types/numeric.transformer';
import { Area } from './area.entity';

// Curated reference table of cities (admin-extendable). Replaces the free-text
// city column on businesses. Slug is the stable handle for seeds, migrations,
// and admin imports; UI surfaces `name` / `name_ar`.
@Entity('cities')
export class City extends BaseEntity {
  @Index({ unique: true })
  @Column({ type: 'varchar', length: 80 })
  slug!: string;

  @Column({ type: 'varchar', length: 120 })
  name!: string;

  @Column({ name: 'name_ar', type: 'varchar', length: 120 })
  nameAr!: string;

  @Column({ type: 'varchar', length: 120, nullable: true })
  governorate!: string | null;

  // lat/lng NUMERIC(9,6) — ~10cm precision worldwide, same convention as Business.
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

  @Column({ name: 'sort_order', type: 'int', default: 0 })
  sortOrder!: number;

  @Column({ name: 'is_active', type: 'boolean', default: true })
  isActive!: boolean;

  @OneToMany(() => Area, (area) => area.city)
  areas!: Area[];
}
