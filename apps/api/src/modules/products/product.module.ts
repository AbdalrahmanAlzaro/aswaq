import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from '../../database/entities/product.entity';
import { Business } from '../../database/entities/business.entity';
import { PriceHistory } from '../../database/entities/price-history.entity';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { PriceHistoryService } from './price-history.service';

@Module({
  imports: [TypeOrmModule.forFeature([Product, Business, PriceHistory])],
  controllers: [ProductController],
  providers: [ProductService, PriceHistoryService],
  exports: [ProductService, PriceHistoryService],
})
export class ProductModule {}
