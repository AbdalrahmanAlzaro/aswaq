import { Column, Entity, Index, OneToMany } from 'typeorm';
import { BaseEntity } from './base.entity';
import { UserRole } from '../../shared/types/enums';
import { Business } from './business.entity';
import { Review } from './review.entity';

@Entity('users')
export class User extends BaseEntity {
  @Index({ unique: true })
  @Column({ type: 'varchar', length: 255 })
  email!: string;

  // never selected by default; must opt in with .addSelect (see UserService.findForLogin)
  @Column({ name: 'password_hash', type: 'varchar', length: 255, select: false })
  passwordHash!: string;

  @Column({ type: 'varchar', length: 120 })
  name!: string;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.SHOPPER })
  role!: UserRole;

  // Premium shoppers can compare luxury items (prototype paywall).
  @Column({ name: 'is_premium', type: 'boolean', default: false })
  isPremium!: boolean;

  @OneToMany(() => Business, (business) => business.owner)
  businesses!: Business[];

  @OneToMany(() => Review, (review) => review.user)
  reviews!: Review[];
}
