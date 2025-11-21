import { StoreMapper } from '@module/store/application/mapper/store.mapper';
import { STORE_REPOSITORY_KEY } from '@module/store/application/repository/store.repository.interface';
import { StoreCrudUseCase } from '@module/store/application/use-cases/store-crud.use-case';
import { StorePostgresRepository } from '@module/store/infrastructure/database/store.postgres.repository';
import { StoreSchema } from '@module/store/infrastructure/database/store.schema';
import { StoreController } from '@module/store/interface/store.controller';
import { Module, Provider } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

const storeRepositoryProvider: Provider = {
  provide: STORE_REPOSITORY_KEY,
  useClass: StorePostgresRepository,
};

@Module({
  imports: [TypeOrmModule.forFeature([StoreSchema])],
  controllers: [StoreController],
  providers: [StoreCrudUseCase, storeRepositoryProvider, StoreMapper],
  exports: [StoreCrudUseCase],
})
export class StoreModule {}
