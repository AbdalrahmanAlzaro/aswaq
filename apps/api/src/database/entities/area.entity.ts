import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from './base.entity';
import { NumericTransformer } from '../../shared/types/numeric.transformer';
import { City } from './city.entity';

// "Places inside a city" — neighbourhoods, districts. Belongs to one City via
// city_id (no FK, per the project convention). Slug is globally unique using
// the `<city-slug>-<area-slug>` pattern so the migration can ON CONFLICT.
@Entity('areas')
export class Area extends BaseEntity {
  @ManyToOne(() => City, (city) => city.areas, {
    createForeignKeyConstraints: false,
  })
  @JoinColumn({ name: 'city_id' })
  city!: City;

  @Index()
  @Column({ name: 'city_id', type: 'uuid' })
  cityId!: string;

  @Index({ unique: true })
  @Column({ type: 'varchar', length: 100 })
  slug!: string;

  @Column({ type: 'varchar', length: 120 })
  name!: string;

  @Column({ name: 'name_ar', type: 'varchar', length: 120 })
  nameAr!: string;

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
}
