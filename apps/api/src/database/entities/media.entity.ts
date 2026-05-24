import { Column, Entity, Index } from 'typeorm';
import { BaseEntity } from './base.entity';
import { MediaKind, MediaOwnerType } from '../../shared/types/enums';

// Polymorphic media: owner_id points at businesses/products/reviews (no FK by design — the
// existing data-model policy already forbids FK constraints, and polymorphism would defeat
// them anyway). The (owner_type, owner_id) pair is what scopes a lookup.
@Entity('media')
@Index('idx_media_owner', ['ownerType', 'ownerId'])
export class Media extends BaseEntity {
  @Column({ name: 'owner_type', type: 'enum', enum: MediaOwnerType })
  ownerType!: MediaOwnerType;

  @Index()
  @Column({ name: 'owner_id', type: 'uuid' })
  ownerId!: string;

  @Column({ type: 'varchar', length: 500 })
  url!: string;

  @Column({ type: 'enum', enum: MediaKind, default: MediaKind.GALLERY })
  kind!: MediaKind;

  @Column({ name: 'sort_order', type: 'int', default: 0 })
  sortOrder!: number;

  @Column({ name: 'alt_text', type: 'varchar', length: 255, nullable: true })
  altText!: string | null;
}
