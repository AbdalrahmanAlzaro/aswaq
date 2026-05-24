import {
  Body,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { GenericController } from '../../shared/decorators/generic-controller.decorator';
import { Public } from '../../shared/decorators/public.decorator';
import { Roles } from '../../shared/decorators/roles.decorator';
import { RolesGuard } from '../../shared/guards/roles.guard';
import { CurrentUser, type AuthUser } from '../../shared/decorators/current-user.decorator';
import { UserRole } from '../../shared/types/enums';
import { SubscriptionService } from './subscription.service';
import { CreatePlanDto } from './dto/create-plan.dto';
import { SubscribeBusinessDto } from './dto/subscribe-business.dto';

@GenericController('subscriptions', true)
export class SubscriptionController {
  constructor(private readonly service: SubscriptionService) {}

  @Public()
  @Get('plans')
  listPlans() {
    return this.service.listPlans();
  }

  @Roles(UserRole.ADMIN)
  @UseGuards(RolesGuard)
  @Post('plans')
  createPlan(@Body() dto: CreatePlanDto) {
    return this.service.createPlan(dto);
  }

  // business owner subscribes their business to a plan
  @Roles(UserRole.BUSINESS, UserRole.ADMIN)
  @UseGuards(RolesGuard)
  @Post()
  subscribe(@Body() dto: SubscribeBusinessDto, @CurrentUser() user: AuthUser) {
    return this.service.subscribe(dto, user);
  }

  @Get()
  findForBusiness(
    @Query('businessId', ParseUUIDPipe) businessId: string,
    @CurrentUser() user: AuthUser,
  ) {
    return this.service.findForBusiness(businessId, user);
  }

  @Delete(':id')
  cancel(@Param('id', ParseUUIDPipe) id: string, @CurrentUser() user: AuthUser) {
    return this.service.cancel(id, user);
  }
}
