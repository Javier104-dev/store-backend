import { AppExceptionFilter } from '@module/app/application/filter/app-exception.filter';
import { GetCurrentEndpointInterceptor } from '@module/app/application/interceptor/get-current-endpoint-interceptor';
import { AppService } from '@module/app/application/service/app.service';
import {
  INestApplication,
  ValidationPipe,
  VersioningType,
} from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

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
    .setTitle('Geek Shop API')
    .setDescription('REST API for a geek products store')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
};
