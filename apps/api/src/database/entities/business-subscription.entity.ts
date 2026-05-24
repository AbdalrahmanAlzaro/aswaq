import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from './base.entity';
import { Business } from './business.entity';
import { SubscriptionPlan } from './subscription-plan.entity';

@Entity('business_subscriptions')
export class BusinessSubscription extends BaseEntity {
  @ManyToOne(() => Business, { createForeignKeyConstraints: false })
  @JoinColumn({ name: 'business_id' })
  business!: Business;

  @Index()
  @Column({ name: 'business_id', type: 'uuid' })
  businessId!: string;

  @ManyToOne(() => SubscriptionPlan, (plan) => plan.subscriptions, {
    createForeignKeyConstraints: false,
  })
  @JoinColumn({ name: 'plan_id' })
  plan!: SubscriptionPlan;

  @Index()
  @Column({ name: 'plan_id', type: 'uuid' })
  planId!: string;

  @Column({ name: 'starts_at', type: 'timestamptz' })
  startsAt!: Date;

  @Column({ name: 'ends_at', type: 'timestamptz' })
  endsAt!: Date;

  @Column({ name: 'is_active', type: 'boolean', default: true })
  isActive!: boolean;

  @Column({ name: 'cancelled_at', type: 'timestamptz', nullable: true })
  cancelledAt!: Date | null;
}
