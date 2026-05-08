import { AuthorizationModule } from '@module/iam/authorization/authorization.module';
import { ProductMapper } from '@module/product/application/mapper/product.mapper';
import { CreateProductPolicyHandler } from '@module/product/application/policy/create-product.policy-handler';
import { DeleteProductPolicyHandler } from '@module/product/application/policy/delete-product.policy-handler';
import { ReadProductPolicyHandler } from '@module/product/application/policy/read-product.policy-handler';
import { UpdateProductPolicyHandler } from '@module/product/application/policy/update-product.policy-handler';
import { PRODUCT_REPOSITORY_KEY } from '@module/product/application/repository/product.repository.interface';
import { ProductCrudUseCase } from '@module/product/application/use-cases/product-crud.use-case';
import { productPermissions } from '@module/product/domain/product.permission';
import { ProductPostgresRepository } from '@module/product/infrastructure/database/product.postgres.repository';
import { ProductSchema } from '@module/product/infrastructure/database/product.schema';
import { ProductController } from '@module/product/interface/product.controller';
import { StoreModule } from '@module/store/store.module';
import { UploadModule } from '@module/upload/upload.module';
import { Module, Provider } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

const policyHandlersProviders = [
  ReadProductPolicyHandler,
  CreateProductPolicyHandler,
  UpdateProductPolicyHandler,
  DeleteProductPolicyHandler,
];
const productRepositoryProvider: Provider = {
  provide: PRODUCT_REPOSITORY_KEY,
  useClass: ProductPostgresRepository,
};

@Module({
  imports: [
    TypeOrmModule.forFeature([ProductSchema]),
    AuthorizationModule.forFeature({
      permissions: productPermissions,
    }),
    StoreModule,
    UploadModule,
  ],
  controllers: [ProductController],
  providers: [
    ProductCrudUseCase,
    productRepositoryProvider,
    ProductMapper,
    ...policyHandlersProviders,
  ],
  exports: [ProductCrudUseCase, AuthorizationModule],
})
export class ProductModule {}
