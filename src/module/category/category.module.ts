import { CategoryMapper } from '@module/category/application/mapper/category.mapper';
import { CATEGORY_REPOSITORY_KEY } from '@module/category/application/repository/category.repository.interface';
import { CategoryCrudUseCase } from '@module/category/application/use-cases/category-crud.use-case';
import { CategoryPostgresRepository } from '@module/category/infrastructure/database/category.postgres.repository';
import { CategorySchema } from '@module/category/infrastructure/database/category.schema';
import { CategoryController } from '@module/category/interface/category.controller';
import { Module, Provider } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

const categoryRepositoryProvider: Provider = {
  provide: CATEGORY_REPOSITORY_KEY,
  useClass: CategoryPostgresRepository,
};

@Module({
  imports: [TypeOrmModule.forFeature([CategorySchema])],
  controllers: [CategoryController],
  providers: [CategoryCrudUseCase, categoryRepositoryProvider, CategoryMapper],
  exports: [CategoryCrudUseCase],
})
export class CategoryModule {}
