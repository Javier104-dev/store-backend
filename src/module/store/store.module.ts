import { Module, Provider } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { STORE_REPOSITORY_KEY } from './application/repository/store.repository.interface';
import { StoreCrudUseCase } from './application/use-cases/store-crud.use-case';
import { StorePostgresRepository } from './infrastructure/database/store.postgres.repository';
import { StoreSchema } from './infrastructure/database/store.schema';
import { StoreController } from './interface/store.controller';

const storeRepositoryProvider: Provider = {
  provide: STORE_REPOSITORY_KEY,
  useClass: StorePostgresRepository,
};

@Module({
  imports: [TypeOrmModule.forFeature([StoreSchema])],
  controllers: [StoreController],
  providers: [StoreCrudUseCase, storeRepositoryProvider],
})
export class StoreModule {}
