import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from './base.entity';
import { User } from './user.entity';
import { Business } from './business.entity';

// One row per (user, business). Uniqueness is enforced at the DB level so concurrent
// "favorite" clicks can't double-insert.
@Entity('favorites')
@Index('uq_favorites_user_business', ['userId', 'businessId'], { unique: true })
export class Favorite extends BaseEntity {
  @ManyToOne(() => User, { createForeignKeyConstraints: false })
  @JoinColumn({ name: 'user_id' })
  user!: User;

  @Index()
  @Column({ name: 'user_id', type: 'uuid' })
  userId!: string;

  @ManyToOne(() => Business, { createForeignKeyConstraints: false })
  @JoinColumn({ name: 'business_id' })
  business!: Business;

  @Index()
  @Column({ name: 'business_id', type: 'uuid' })
  businessId!: string;
}
