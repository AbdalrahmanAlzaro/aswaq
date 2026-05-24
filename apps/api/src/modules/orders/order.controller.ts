import { Body, Get, Param, ParseUUIDPipe, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { GenericController } from '../../shared/decorators/generic-controller.decorator';
import { Roles } from '../../shared/decorators/roles.decorator';
import { RolesGuard } from '../../shared/guards/roles.guard';
import { CurrentUser, type AuthUser } from '../../shared/decorators/current-user.decorator';
import { UserRole } from '../../shared/types/enums';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { FindOrdersDto } from './dto/find-orders.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';

@GenericController('orders', true)
export class OrderController {
  constructor(private readonly service: OrderService) {}

  // shoppers see their own orders, owners/admins see their business's orders (via ?businessId=)
  @Get()
  findAll(@Query() dto: FindOrdersDto, @CurrentUser() user: AuthUser) {
    return this.service.findAll(dto, user);
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string, @CurrentUser() user: AuthUser) {
    return this.service.findOne(id, user);
  }

  // only shoppers can place orders
  @Roles(UserRole.SHOPPER)
  @UseGuards(RolesGuard)
  @Post()
  create(@Body() dto: CreateOrderDto, @CurrentUser() user: AuthUser) {
    return this.service.create(dto, user);
  }

  @Patch(':id/status')
  updateStatus(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateOrderStatusDto,
    @CurrentUser() user: AuthUser,
  ) {
    return this.service.updateStatus(id, dto, user);
  }
}
