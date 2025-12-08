import { AppService } from '@module/app/application/service/app.service';
import { ResponseSerializerService } from '@module/app/application/service/response-serializer.service';
import { AuthorModule } from '@module/author/author.module';
import { BookModule } from '@module/book/book.module';
import { CatalogModule } from '@module/catalog/catalog.module';
import { CategoryModule } from '@module/category/category.module';
import { GenreModule } from '@module/genre/genre.module';
import { HealthController } from '@module/health/interface/health.controller';
import { AuthenticationModule } from '@module/iam/authentication/authentication.module';
import { IamModule } from '@module/iam/iam.module';
import { ProductModule } from '@module/product/product.module';
import { StoreModule } from '@module/store/store.module';
import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DiscoveryModule } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { addTransactionalDataSource } from 'typeorm-transactional';

import { BaseResponseAdapter } from '@common/base/application/adapter/base-response.adapter';
import { DtoMapper } from '@common/base/application/mapper/dto.mapper';

import { environmentConfig } from '@config/environment.config';
import { datasourceOptions } from '@config/orm.config';

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
    DiscoveryModule,
    BookModule,
    AuthorModule,
    GenreModule,
    ProductModule,
    CategoryModule,
    StoreModule,
    CatalogModule,
  ],
  providers: [
    AppService,
    ResponseSerializerService,
    BaseResponseAdapter,
    DtoMapper,
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
