import { Body, Delete, Get, Param, ParseUUIDPipe, Post, UseGuards } from '@nestjs/common';
import { GenericController } from '../../shared/decorators/generic-controller.decorator';
import { Roles } from '../../shared/decorators/roles.decorator';
import { RolesGuard } from '../../shared/guards/roles.guard';
import { CurrentUser, type AuthUser } from '../../shared/decorators/current-user.decorator';
import { UserRole } from '../../shared/types/enums';
import { FavoriteService } from './favorite.service';
import { CreateFavoriteDto } from './dto/create-favorite.dto';

// Favorites are shopper-only — owners/admins don't have personal "saved places".
@Roles(UserRole.SHOPPER)
@UseGuards(RolesGuard)
@GenericController('favorites', true)
export class FavoriteController {
  constructor(private readonly service: FavoriteService) {}

  @Get()
  list(@CurrentUser() user: AuthUser) {
    return this.service.list(user);
  }

  @Post()
  add(@Body() dto: CreateFavoriteDto, @CurrentUser() user: AuthUser) {
    return this.service.add(dto, user);
  }

  @Delete(':businessId')
  remove(
    @Param('businessId', ParseUUIDPipe) businessId: string,
    @CurrentUser() user: AuthUser,
  ) {
    return this.service.remove(businessId, user);
  }
}
