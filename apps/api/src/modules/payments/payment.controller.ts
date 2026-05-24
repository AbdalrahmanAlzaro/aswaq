import { Body, Get, Param, ParseUUIDPipe, Post, Query } from '@nestjs/common';
import { GenericController } from '../../shared/decorators/generic-controller.decorator';
import { CurrentUser, type AuthUser } from '../../shared/decorators/current-user.decorator';
import { PaymentService } from './payment.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { FindPaymentsDto } from './dto/find-payments.dto';

@GenericController('payments', true)
export class PaymentController {
  constructor(private readonly service: PaymentService) {}

  @Get()
  findAll(@Query() dto: FindPaymentsDto, @CurrentUser() user: AuthUser) {
    return this.service.findAll(dto, user);
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string, @CurrentUser() user: AuthUser) {
    return this.service.findOne(id, user);
  }

  @Post()
  create(@Body() dto: CreatePaymentDto, @CurrentUser() user: AuthUser) {
    return this.service.create(dto, user);
  }
}
