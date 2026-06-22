import { CategoryMapper } from '@module/category/application/mapper/category.mapper';
import { CreateCategoryPolicyHandler } from '@module/category/application/policy/create-category.policy-handler';
import { DeleteCategoryPolicyHandler } from '@module/category/application/policy/delete-category.policy-handler';
import { UpdateCategoryPolicyHandler } from '@module/category/application/policy/update-category.policy-handler';
import { CATEGORY_REPOSITORY_KEY } from '@module/category/application/repository/category.repository.interface';
import { CategoryService } from '@module/category/application/service/category.service';
import { CategoryCrudUseCase } from '@module/category/application/use-cases/category-crud.use-case';
import { categoryPermissions } from '@module/category/domain/category.permission';
import { CategoryPostgresRepository } from '@module/category/infrastructure/database/category.postgres.repository';
import { CategorySchema } from '@module/category/infrastructure/database/category.schema';
import { CategoryController } from '@module/category/interface/category.controller';
import { AuthorizationModule } from '@module/iam/authorization/authorization.module';
import { Module, Provider } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

const policyHandlersProviders = [
  CreateCategoryPolicyHandler,
  UpdateCategoryPolicyHandler,
  DeleteCategoryPolicyHandler,
];

const categoryRepositoryProvider: Provider = {
  provide: CATEGORY_REPOSITORY_KEY,
  useClass: CategoryPostgresRepository,
};

@Module({
  imports: [
    TypeOrmModule.forFeature([CategorySchema]),
    AuthorizationModule.forFeature({
      permissions: categoryPermissions,
    }),
  ],
  controllers: [CategoryController],
  providers: [
    CategoryCrudUseCase,
    CategoryService,
    categoryRepositoryProvider,
    CategoryMapper,
    ...policyHandlersProviders,
  ],
  exports: [CategoryService],
})
export class CategoryModule {}
