import { DatabaseModule } from '@module/db/database.module';
import { AuthenticationModule } from '@module/iam/authentication/authentication.module';
import { IamModule } from '@module/iam/iam.module';
import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER, DiscoveryModule } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SentryGlobalFilter, SentryModule } from '@sentry/nestjs/setup';
import { DataSource } from 'typeorm';
import { addTransactionalDataSource } from 'typeorm-transactional';

import { BaseResponseAdapter } from '@common/base/application/adapter/base-response.adapter';
import { DtoMapper } from '@common/base/application/mapper/dto.mapper';

import { environmentConfig } from '@config/environment.config';
import { datasourceOptions } from '@config/orm.config';

import { AppService } from '@/module/app/application/service/app.service';
import { ResponseSerializerService } from '@/module/app/application/service/response-serializer.service';
import { AuthorModule } from '@/module/author/author.module';
import { BookModule } from '@/module/book/book.module';
import { GenreModule } from '@/module/genre/genre.module';
import { HealthController } from '@/module/health/interface/health.controller';

import { ProductModule } from './product/product.module';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      load: [environmentConfig],
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      useFactory: () => ({
        ...datasourceOptions,
        autoLoadEntities: true,
      }),
      dataSourceFactory: async (options) => {
        return addTransactionalDataSource(new DataSource(options));
      },
    }),
    AuthenticationModule,
    IamModule,
    DatabaseModule,
    DiscoveryModule,
    BookModule,
    AuthorModule,
    GenreModule,
    ProductModule,
    SentryModule.forRoot(),
  ],
  providers: [
    AppService,
    ResponseSerializerService,
    BaseResponseAdapter,
    DtoMapper,
    {
      provide: APP_FILTER,
      useClass: SentryGlobalFilter,
    },
  ],
  exports: [
    AppService,
    ResponseSerializerService,
    BaseResponseAdapter,
    DtoMapper,
  ],
  controllers: [HealthController],
})
export class AppModule {}
