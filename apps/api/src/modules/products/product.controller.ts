import { Body, Delete, Get, Param, ParseUUIDPipe, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { GenericController } from '../../shared/decorators/generic-controller.decorator';
import { Public } from '../../shared/decorators/public.decorator';
import { Roles } from '../../shared/decorators/roles.decorator';
import { RolesGuard } from '../../shared/guards/roles.guard';
import { CurrentUser, type AuthUser } from '../../shared/decorators/current-user.decorator';
import { UserRole } from '../../shared/types/enums';
import { ProductService } from './product.service';
import { PriceHistoryService } from './price-history.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { CompareProductsDto } from './dto/compare-products.dto';

@GenericController('products', true)
export class ProductController {
  constructor(
    private readonly service: ProductService,
    private readonly priceHistory: PriceHistoryService,
  ) {}

  @Public()
  @Get()
  findByBusiness(@Query('businessId', ParseUUIDPipe) businessId: string) {
    return this.service.findByBusiness(businessId);
  }

  // requires login; enforces Premium for luxury
  @Get('compare')
  compare(@Query() dto: CompareProductsDto, @CurrentUser() user: AuthUser) {
    return this.service.compare(dto.ids, user);
  }

  // append-only price log for a product (public)
  @Public()
  @Get(':id/price-history')
  getPriceHistory(@Param('id', ParseUUIDPipe) id: string) {
    return this.priceHistory.findByProduct(id);
  }

  // Single product with its parent business — used by the product detail page.
  // Registered AFTER more specific paths (compare, :id/price-history) so the
  // literal segments win the route match.
  @Public()
  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.service.findOne(id);
  }

  @Roles(UserRole.BUSINESS, UserRole.ADMIN)
  @UseGuards(RolesGuard)
  @Post()
  create(@Body() dto: CreateProductDto, @CurrentUser() user: AuthUser) {
    return this.service.create(dto, user);
  }

  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateProductDto,
    @CurrentUser() user: AuthUser,
  ) {
    return this.service.update(id, dto, user);
  }

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string, @CurrentUser() user: AuthUser) {
    return this.service.remove(id, user);
  }
}
