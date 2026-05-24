import { Column, Entity, Index, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { BaseEntity } from './base.entity';
import { NumericTransformer } from '../../shared/types/numeric.transformer';
import { OrderStatus } from '../../shared/types/enums';
import { User } from './user.entity';
import { Business } from './business.entity';
import { OrderItem } from './order-item.entity';

@Entity('orders')
export class Order extends BaseEntity {
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

  @Column({
    type: 'enum',
    enum: OrderStatus,
    default: OrderStatus.PENDING,
  })
  status!: OrderStatus;

  // money: NUMERIC(10,2)
  @Column({
    type: 'numeric',
    precision: 10,
    scale: 2,
    transformer: new NumericTransformer(),
  })
  total!: number;

  @Column({ type: 'varchar', length: 8, default: 'JD' })
  currency!: string;

  @Column({ type: 'text', nullable: true })
  notes!: string | null;

  @OneToMany(() => OrderItem, (item) => item.order, { cascade: ['insert'] })
  items!: OrderItem[];
}
