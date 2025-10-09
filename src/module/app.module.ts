import { getAdminJSModule } from '@module/adminjs/config/admin.config';
import { AwsModule } from '@module/aws/aws.module';
import { ChatModule } from '@module/chat/chat.module';
import { DatabaseModule } from '@module/db/database.module';
import { AuthenticationModule } from '@module/iam/authentication/authentication.module';
import { IamModule } from '@module/iam/iam.module';
import { QueueModule } from '@module/queue/queue.module';
import { ThreadModule } from '@module/thread/thread.module';
import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DiscoveryModule } from '@nestjs/core';
import { APP_FILTER } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SentryModule } from '@sentry/nestjs/setup';
import { SentryGlobalFilter } from '@sentry/nestjs/setup';
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

import { AdminChatOpenAIModule } from './adminjs-openai/openai.module';
import { OpenAIModule } from './openai/openai.module';

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
    getAdminJSModule(),
    AuthenticationModule,
    IamModule,
    ChatModule,
    DatabaseModule,
    DiscoveryModule,
    QueueModule,
    AwsModule,
    ThreadModule,
    AdminChatOpenAIModule,
    OpenAIModule,
    BookModule,
    AuthorModule,
    GenreModule,
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
