import { GetCurrentEndpointInterceptor } from '@module/app/application/interceptor/get-current-endpoint-interceptor';
import { AppService } from '@module/app/application/service/app.service';
import { AppExceptionFilter } from '@module/app/interface/exception-filter/app-exception.filter';
import {
  INestApplication,
  ValidationPipe,
  VersioningType,
} from '@nestjs/common';
import { BaseExceptionFilter, HttpAdapterHost } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as Sentry from '@sentry/nestjs';

import { ENVIRONMENT } from '@config/environment.enum';

import './instrument';

export const setupApp = (app: INestApplication) => {
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });

  app.useGlobalInterceptors(
    new GetCurrentEndpointInterceptor(app.get(AppService)),
  );
  app.useGlobalFilters(new AppExceptionFilter());
  app.setGlobalPrefix('api');

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
      whitelist: true,
      forbidNonWhitelisted: true,
      skipMissingProperties: true,
    }),
  );
};

export const setupSwagger = (app: INestApplication) => {
  const config = new DocumentBuilder()
    .setTitle('Bigger Ops API')
    .setDescription('Bigger Ops API description')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
};

export const setupSentry = (app: INestApplication) => {
  if (
    process.env.NODE_ENV === ENVIRONMENT.PRODUCTION ||
    process.env.NODE_ENV === ENVIRONMENT.STAGING ||
    process.env.TEST_SENTRY
  ) {
    const { httpAdapter } = app.get(HttpAdapterHost);
    if (!httpAdapter) {
      console.error('HttpAdapterHost is not available');
    }
    app.useGlobalFilters(new BaseExceptionFilter(httpAdapter));
  }
};
