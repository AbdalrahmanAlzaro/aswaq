import { Column, Entity, Index, OneToMany } from 'typeorm';
import { BaseEntity } from './base.entity';
import { NumericTransformer } from '../../shared/types/numeric.transformer';
import { SubscriptionTier } from '../../shared/types/enums';
import { BusinessSubscription } from './business-subscription.entity';

@Entity('subscription_plans')
export class SubscriptionPlan extends BaseEntity {
  @Index({ unique: true })
  @Column({ type: 'varchar', length: 80 })
  slug!: string;

  @Column({ type: 'varchar', length: 120 })
  name!: string;

  @Column({ type: 'enum', enum: SubscriptionTier })
  tier!: SubscriptionTier;

  // money: NUMERIC(10,2), JD per billing cycle
  @Column({
    type: 'numeric',
    precision: 10,
    scale: 2,
    transformer: new NumericTransformer(),
  })
  price!: number;

  @Column({ type: 'varchar', length: 8, default: 'JD' })
  currency!: string;

  // billing cycle length in days (e.g. 30 for monthly, 365 for yearly)
  @Column({ name: 'period_days', type: 'int' })
  periodDays!: number;

  @Column({ type: 'text', nullable: true })
  description!: string | null;

  @Column({ name: 'is_active', type: 'boolean', default: true })
  isActive!: boolean;

  @OneToMany(() => BusinessSubscription, (sub) => sub.plan)
  subscriptions!: BusinessSubscription[];
}
