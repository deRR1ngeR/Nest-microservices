import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { ApiGatewayModule } from './api-gateway.module';
import { RpcExceptionToHttpExceptionFilter } from './exceptionFilters/rpcExceptionFilter';

async function bootstrap() {
  const app = await NestFactory.create(ApiGatewayModule);

  app.setGlobalPrefix('api');

  app.useGlobalFilters(new RpcExceptionToHttpExceptionFilter())
  app.useGlobalPipes(new ValidationPipe());


  const config = new DocumentBuilder()
    .setTitle('ModsenTestApp')
    .setVersion('0.0.1')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/swagger', app, document);
  await app.listen(3333);
}
bootstrap();
