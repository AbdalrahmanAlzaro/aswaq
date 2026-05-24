import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Payment } from '../../database/entities/payment.entity';
import { BaseRepository } from '../../shared/repo/base.repo';
import { Paginated } from '../../shared/dto/pagination.dto';
import { AuthUser } from '../../shared/decorators/current-user.decorator';
import { PaymentPurpose, PaymentStatus, UserRole } from '../../shared/types/enums';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { FindPaymentsDto } from './dto/find-payments.dto';

@Injectable()
export class PaymentService extends BaseRepository {
  constructor(@InjectRepository(Payment) private readonly repo: Repository<Payment>) {
    super();
  }

  async findAll(dto: FindPaymentsDto, user: AuthUser): Promise<Paginated<Payment>> {
    const qb = this.repo.createQueryBuilder('p');
    if (user.role !== UserRole.ADMIN) {
      qb.andWhere('p.userId = :uid', { uid: user.sub });
    }
    if (dto.purpose) qb.andWhere('p.purpose = :purpose', { purpose: dto.purpose });
    if (dto.status) qb.andWhere('p.status = :status', { status: dto.status });
    return this.paginate(qb, dto, {
      alias: 'p',
      allowedSort: ['createdAt', 'amount', 'status'],
      defaultSort: 'createdAt',
    });
  }

  // Prototype-only: records a payment intent. A real PSP webhook would later flip status.
  create(dto: CreatePaymentDto, user: AuthUser): Promise<Payment> {
    if (dto.purpose === PaymentPurpose.ORDER && !dto.orderId) {
      throw new BadRequestException('orderId is required for ORDER payments');
    }
    if (dto.purpose === PaymentPurpose.BUSINESS_SUBSCRIPTION && !dto.businessSubscriptionId) {
      throw new BadRequestException(
        'businessSubscriptionId is required for BUSINESS_SUBSCRIPTION payments',
      );
    }
    return this.repo.save(
      this.repo.create({
        userId: user.sub,
        purpose: dto.purpose,
        amount: dto.amount,
        orderId: dto.orderId ?? null,
        businessSubscriptionId: dto.businessSubscriptionId ?? null,
        providerRef: dto.providerRef ?? null,
        status: PaymentStatus.PENDING,
      }),
    );
  }

  async findOne(id: string, user: AuthUser): Promise<Payment> {
    const payment = await this.repo.findOne({ where: { id } });
    if (!payment) throw new NotFoundException('Payment not found');
    if (user.role !== UserRole.ADMIN && payment.userId !== user.sub) {
      throw new NotFoundException('Payment not found');
    }
    return payment;
  }
}
