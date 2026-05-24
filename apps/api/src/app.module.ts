import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import appConfig from './config/app.config';
import { JwtAuthModule } from './shared/modules/jwt-auth/jwt-auth.module';
import { JwtAuthGuard } from './shared/guards/jwt-auth.guard';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/users/user.module';
import { BusinessModule } from './modules/businesses/business.module';
import { CategoryModule } from './modules/categories/category.module';
import { ProductModule } from './modules/products/product.module';
import { ReviewModule } from './modules/reviews/review.module';
import { OrderModule } from './modules/orders/order.module';
import { SubscriptionModule } from './modules/subscriptions/subscription.module';
import { PaymentModule } from './modules/payments/payment.module';
import { MediaModule } from './modules/media/media.module';
import { FavoriteModule } from './modules/favorites/favorite.module';
import { CatalogModule } from './modules/catalog/catalog.module';
import { CityModule } from './modules/cities/city.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [appConfig] }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get<string>('database.host'),
        port: config.get<number>('database.port'),
        username: config.get<string>('database.username'),
        password: config.get<string>('database.password'),
        database: config.get<string>('database.name'),
        autoLoadEntities: true,
        synchronize: config.get<boolean>('database.synchronize'),
        logging: config.get<boolean>('database.logging'),
      }),
    }),
    JwtAuthModule,
    AuthModule,
    UserModule,
    BusinessModule,
    CategoryModule,
    ProductModule,
    ReviewModule,
    OrderModule,
    SubscriptionModule,
    PaymentModule,
    MediaModule,
    FavoriteModule,
    CatalogModule,
    CityModule,
  ],
  providers: [
    // JWT auth runs on every route; @Public() opts a route out.
    { provide: APP_GUARD, useClass: JwtAuthGuard },
  ],
})
export class AppModule {}
