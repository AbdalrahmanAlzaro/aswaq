import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { SubscriptionPlan } from '../../database/entities/subscription-plan.entity';
import { BusinessSubscription } from '../../database/entities/business-subscription.entity';
import { Business } from '../../database/entities/business.entity';
import { AuthUser } from '../../shared/decorators/current-user.decorator';
import { UserRole } from '../../shared/types/enums';
import { CreatePlanDto } from './dto/create-plan.dto';
import { SubscribeBusinessDto } from './dto/subscribe-business.dto';

@Injectable()
export class SubscriptionService {
  constructor(
    @InjectRepository(SubscriptionPlan) private readonly planRepo: Repository<SubscriptionPlan>,
    @InjectRepository(BusinessSubscription)
    private readonly subRepo: Repository<BusinessSubscription>,
    private readonly dataSource: DataSource,
  ) {}

  listPlans(): Promise<SubscriptionPlan[]> {
    return this.planRepo.find({
      where: { isActive: true },
      order: { price: 'ASC' },
    });
  }

  createPlan(dto: CreatePlanDto): Promise<SubscriptionPlan> {
    return this.planRepo.save(this.planRepo.create(dto));
  }

  // owner subscribes their business to a plan (transaction: write sub + bump business tier)
  async subscribe(dto: SubscribeBusinessDto, user: AuthUser): Promise<BusinessSubscription> {
    return this.dataSource.transaction(async (manager) => {
      const business = await manager.findOne(Business, { where: { id: dto.businessId } });
      if (!business) throw new NotFoundException('Business not found');
      if (user.role !== UserRole.ADMIN && business.ownerId !== user.sub) {
        throw new ForbiddenException('You do not own this business');
      }
      const plan = await manager.findOne(SubscriptionPlan, { where: { id: dto.planId } });
      if (!plan) throw new NotFoundException('Plan not found');

      const now = new Date();
      const endsAt = new Date(now.getTime() + plan.periodDays * 24 * 60 * 60 * 1000);

      // deactivate any current active subscription for this business
      await manager.update(
        BusinessSubscription,
        { businessId: business.id, isActive: true },
        { isActive: false, cancelledAt: now },
      );

      const sub = await manager.save(
        manager.create(BusinessSubscription, {
          businessId: business.id,
          planId: plan.id,
          startsAt: now,
          endsAt,
          isActive: true,
        }),
      );

      await manager.update(Business, business.id, { subscriptionTier: plan.tier });
      return sub;
    });
  }

  async cancel(id: string, user: AuthUser): Promise<{ id: string }> {
    const sub = await this.subRepo.findOne({ where: { id } });
    if (!sub) throw new NotFoundException('Subscription not found');
    const business = await this.dataSource
      .getRepository(Business)
      .findOne({ where: { id: sub.businessId } });
    if (!business) throw new NotFoundException('Business not found');
    if (user.role !== UserRole.ADMIN && business.ownerId !== user.sub) {
      throw new ForbiddenException('You do not own this business');
    }
    sub.isActive = false;
    sub.cancelledAt = new Date();
    await this.subRepo.save(sub);
    return { id };
  }

  async findForBusiness(businessId: string, user: AuthUser): Promise<BusinessSubscription[]> {
    if (user.role !== UserRole.ADMIN) {
      const business = await this.dataSource
        .getRepository(Business)
        .findOne({ where: { id: businessId } });
      if (!business) throw new NotFoundException('Business not found');
      if (business.ownerId !== user.sub) {
        throw new ForbiddenException('You do not own this business');
      }
    }
    return this.subRepo.find({
      where: { businessId },
      order: { createdAt: 'DESC' },
      relations: { plan: true },
    });
  }
}
