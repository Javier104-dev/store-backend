import { AuthorizationModule } from '@module/iam/authorization/authorization.module';
import { StoreMapper } from '@module/store/application/mapper/store.mapper';
import { CreateStorePolicyHandler } from '@module/store/application/policy/create-store.policy-handler';
import { DeleteStorePolicyHandler } from '@module/store/application/policy/delete-store.policy-handler';
import { ReadStorePolicyHandler } from '@module/store/application/policy/read-store.policy-handler';
import { UpdateStorePolicyHandler } from '@module/store/application/policy/update-store.policy-handler';
import { STORE_REPOSITORY_KEY } from '@module/store/application/repository/store.repository.interface';
import { StoreCrudUseCase } from '@module/store/application/use-cases/store-crud.use-case';
import { storePermissions } from '@module/store/domain/store.permission';
import { StorePostgresRepository } from '@module/store/infrastructure/database/store.postgres.repository';
import { StoreSchema } from '@module/store/infrastructure/database/store.schema';
import { StoreController } from '@module/store/interface/store.controller';
import { Module, Provider } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

const policyHandlersProviders = [
  ReadStorePolicyHandler,
  CreateStorePolicyHandler,
  UpdateStorePolicyHandler,
  DeleteStorePolicyHandler,
];

const storeRepositoryProvider: Provider = {
  provide: STORE_REPOSITORY_KEY,
  useClass: StorePostgresRepository,
};

@Module({
  imports: [
    TypeOrmModule.forFeature([StoreSchema]),
    AuthorizationModule.forFeature({
      permissions: storePermissions,
    }),
  ],
  controllers: [StoreController],
  providers: [
    StoreCrudUseCase,
    storeRepositoryProvider,
    StoreMapper,
    ...policyHandlersProviders,
  ],
  exports: [StoreCrudUseCase],
})
export class StoreModule {}
