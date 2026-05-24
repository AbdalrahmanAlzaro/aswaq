import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, In, Repository } from 'typeorm';
import { Order } from '../../database/entities/order.entity';
import { OrderItem } from '../../database/entities/order-item.entity';
import { Product } from '../../database/entities/product.entity';
import { Business } from '../../database/entities/business.entity';
import { BaseRepository } from '../../shared/repo/base.repo';
import { Paginated } from '../../shared/dto/pagination.dto';
import { AuthUser } from '../../shared/decorators/current-user.decorator';
import { OrderStatus, UserRole } from '../../shared/types/enums';
import { CreateOrderDto } from './dto/create-order.dto';
import { FindOrdersDto } from './dto/find-orders.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';

// Aswaq enforces a 25 JD minimum total per business in the cart (product brief).
const MIN_ORDER_TOTAL_JD = 25;

@Injectable()
export class OrderService extends BaseRepository {
  constructor(
    @InjectRepository(Order) private readonly repo: Repository<Order>,
    private readonly dataSource: DataSource,
  ) {
    super();
  }

  async findAll(dto: FindOrdersDto, user: AuthUser): Promise<Paginated<Order>> {
    const qb = this.repo.createQueryBuilder('o');

    if (user.role === UserRole.SHOPPER) {
      // shoppers see only their own orders
      qb.andWhere('o.userId = :uid', { uid: user.sub });
    } else if (user.role === UserRole.BUSINESS) {
      // business owners see orders for businesses they own; require businessId filter
      if (!dto.businessId) {
        throw new BadRequestException('businessId is required for business accounts');
      }
      await this.assertOwnsBusiness(dto.businessId, user);
      qb.andWhere('o.businessId = :bid', { bid: dto.businessId });
    } else if (dto.businessId) {
      qb.andWhere('o.businessId = :bid', { bid: dto.businessId });
    }

    if (dto.status) qb.andWhere('o.status = :status', { status: dto.status });

    return this.paginate(qb, dto, {
      alias: 'o',
      allowedSort: ['createdAt', 'total', 'status'],
      defaultSort: 'createdAt',
    });
  }

  async findOne(id: string, user: AuthUser): Promise<Order> {
    const order = await this.repo.findOne({
      where: { id },
      relations: { items: true },
    });
    if (!order) throw new NotFoundException('Order not found');
    await this.assertCanRead(order, user);
    return order;
  }

  // One logical operation touches 3 tables, so it runs in a single transaction.
  async create(dto: CreateOrderDto, user: AuthUser): Promise<Order> {
    return this.dataSource.transaction(async (manager) => {
      const business = await manager.findOne(Business, { where: { id: dto.businessId } });
      if (!business) throw new NotFoundException('Business not found');

      const productIds = dto.items.map((i) => i.productId);
      const products = await manager.find(Product, { where: { id: In(productIds) } });
      if (products.length !== productIds.length) {
        throw new NotFoundException('One or more products not found');
      }

      const byId = new Map(products.map((p) => [p.id, p]));
      let total = 0;
      const itemRows = dto.items.map((line) => {
        const product = byId.get(line.productId)!;
        if (product.businessId !== dto.businessId) {
          throw new BadRequestException(
            `Product ${product.id} does not belong to that business`,
          );
        }
        if (!product.isAvailable) {
          throw new BadRequestException(`Product ${product.name} is not available`);
        }
        const lineTotal = +(product.price * line.quantity).toFixed(2);
        total = +(total + lineTotal).toFixed(2);
        return manager.create(OrderItem, {
          productId: product.id,
          productName: product.name,
          unitPrice: product.price,
          quantity: line.quantity,
          lineTotal,
        });
      });

      if (total < MIN_ORDER_TOTAL_JD) {
        throw new BadRequestException(
          `Minimum order total is ${MIN_ORDER_TOTAL_JD} JD per business (cart total: ${total} JD)`,
        );
      }

      const order = await manager.save(
        manager.create(Order, {
          userId: user.sub,
          businessId: dto.businessId,
          status: OrderStatus.PENDING,
          total,
          currency: 'JD',
          notes: dto.notes ?? null,
        }),
      );

      for (const item of itemRows) item.orderId = order.id;
      order.items = await manager.save(itemRows);
      return order;
    });
  }

  async updateStatus(
    id: string,
    dto: UpdateOrderStatusDto,
    user: AuthUser,
  ): Promise<Order> {
    const order = await this.repo.findOne({ where: { id } });
    if (!order) throw new NotFoundException('Order not found');

    // shoppers may cancel their own pending orders; owners/admins may move to any status
    if (user.role === UserRole.SHOPPER) {
      if (order.userId !== user.sub) throw new ForbiddenException('Not your order');
      if (dto.status !== OrderStatus.CANCELLED || order.status !== OrderStatus.PENDING) {
        throw new ForbiddenException('Shoppers may only cancel their own pending orders');
      }
    } else if (user.role === UserRole.BUSINESS) {
      await this.assertOwnsBusiness(order.businessId, user);
    }

    order.status = dto.status;
    return this.repo.save(order);
  }

  private async assertCanRead(order: Order, user: AuthUser) {
    if (user.role === UserRole.ADMIN) return;
    if (user.role === UserRole.SHOPPER && order.userId === user.sub) return;
    if (user.role === UserRole.BUSINESS) {
      await this.assertOwnsBusiness(order.businessId, user);
      return;
    }
    throw new ForbiddenException('You may not read this order');
  }

  private async assertOwnsBusiness(businessId: string, user: AuthUser) {
    if (user.role === UserRole.ADMIN) return;
    const business = await this.dataSource
      .getRepository(Business)
      .findOne({ where: { id: businessId } });
    if (!business) throw new NotFoundException('Business not found');
    if (business.ownerId !== user.sub) {
      throw new ForbiddenException('You do not own this business');
    }
  }
}
