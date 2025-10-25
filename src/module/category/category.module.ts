import { Module, Provider } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CATEGORY_REPOSITORY_KEY } from './application/repository/category.repository.interface';
import { CategoryCrudUseCase } from './application/use-cases/category-crud.use-case';
import { CategoryPostgresRepository } from './infrastructure/database/category.postgres.repository';
import { CategorySchema } from './infrastructure/database/category.schema';
import { CategoryController } from './interface/category.controller';

const categoryRepositoryProvider: Provider = {
  provide: CATEGORY_REPOSITORY_KEY,
  useClass: CategoryPostgresRepository,
};

@Module({
  imports: [TypeOrmModule.forFeature([CategorySchema])],
  controllers: [CategoryController],
  providers: [CategoryCrudUseCase, categoryRepositoryProvider],
})
export class CategoryModule {}
