import { Body, Get, Param, ParseUUIDPipe, Post, Query, UseGuards } from '@nestjs/common';
import { GenericController } from '../../shared/decorators/generic-controller.decorator';
import { Public } from '../../shared/decorators/public.decorator';
import { Roles } from '../../shared/decorators/roles.decorator';
import { RolesGuard } from '../../shared/guards/roles.guard';
import { UserRole } from '../../shared/types/enums';
import { CatalogService } from './catalog.service';
import { CreateCatalogItemDto } from './dto/create-catalog-item.dto';
import { FindCatalogDto } from './dto/find-catalog.dto';

@GenericController('catalog', true)
export class CatalogController {
  constructor(private readonly service: CatalogService) {}

  @Public()
  @Get()
  findAll(@Query() dto: FindCatalogDto) {
    return this.service.findAll(dto);
  }

  @Public()
  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.service.findOne(id);
  }

  // Every seller's offer for the canonical item, sorted ascending; cheapest
  // row is marked. Public — anyone can compare prices.
  @Public()
  @Get(':id/offers')
  findOffers(@Param('id', ParseUUIDPipe) id: string) {
    return this.service.findOffers(id);
  }

  // Business owners and admins can register a new catalog item before
  // attaching a Product to it.
  @Roles(UserRole.BUSINESS, UserRole.ADMIN)
  @UseGuards(RolesGuard)
  @Post()
  create(@Body() dto: CreateCatalogItemDto) {
    return this.service.create(dto);
  }
}
