import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './shared/filters/http-exception.filter';
import { QueryFailedExceptionFilter } from './shared/filters/query-failed-exception.filter';
import { ResponseInterceptor } from './shared/interceptors/response.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);

  app.setGlobalPrefix(config.get<string>('app.prefix') ?? 'api/v1');

  // Explicit CORS origin (Safeer Part 6 item 5: never open CORS).
  app.enableCors({
    origin: config.get<string>('app.webOrigin'),
    credentials: true,
  });

  // Global validation WITH whitelist + transform (Safeer Part 2.4: they forgot the options).
  app.useGlobalPipes(
    new ValidationPipe({ whitelist: true, transform: true }),
  );

  app.useGlobalFilters(new HttpExceptionFilter(), new QueryFailedExceptionFilter());
  app.useGlobalInterceptors(new ResponseInterceptor());

  // Swagger only outside production.
  if (config.get<string>('app.env') !== 'production') {
    const doc = new DocumentBuilder()
      .setTitle('Aswaq API')
      .setDescription('Local price comparison, reviews & marketplace')
      .setVersion('0.1.0')
      .addBearerAuth()
      .build();
    SwaggerModule.setup('doc', app, SwaggerModule.createDocument(app, doc));
  }

  const port = config.get<number>('app.port') ?? 3001;
  await app.listen(port);
  console.log(`🚀 Aswaq API: http://localhost:${port}/${config.get<string>('app.prefix')}`);
}
void bootstrap();
