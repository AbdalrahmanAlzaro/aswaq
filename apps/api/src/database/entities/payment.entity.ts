import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from './base.entity';
import { NumericTransformer } from '../../shared/types/numeric.transformer';
import { PaymentPurpose, PaymentStatus } from '../../shared/types/enums';
import { User } from './user.entity';

@Entity('payments')
export class Payment extends BaseEntity {
  @ManyToOne(() => User, { createForeignKeyConstraints: false })
  @JoinColumn({ name: 'user_id' })
  user!: User;

  @Index()
  @Column({ name: 'user_id', type: 'uuid' })
  userId!: string;

  // What this payment is for. The matching foreign-id column is filled per-purpose.
  @Column({ type: 'enum', enum: PaymentPurpose })
  purpose!: PaymentPurpose;

  // ORDER -> order_id;  BUSINESS_SUBSCRIPTION -> business_subscription_id;  PREMIUM_UPGRADE -> null
  @Index()
  @Column({ name: 'order_id', type: 'uuid', nullable: true })
  orderId!: string | null;

  @Index()
  @Column({ name: 'business_subscription_id', type: 'uuid', nullable: true })
  businessSubscriptionId!: string | null;

  @Column({
    type: 'numeric',
    precision: 10,
    scale: 2,
    transformer: new NumericTransformer(),
  })
  amount!: number;

  @Column({ type: 'varchar', length: 8, default: 'JD' })
  currency!: string;

  @Column({
    type: 'enum',
    enum: PaymentStatus,
    default: PaymentStatus.PENDING,
  })
  status!: PaymentStatus;

  // upstream PSP reference (Stripe / HyperPay / etc.) — opaque to us
  @Column({ name: 'provider_ref', type: 'varchar', length: 255, nullable: true })
  providerRef!: string | null;
}
