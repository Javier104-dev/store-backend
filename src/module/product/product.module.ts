import { PRODUCT_REPOSITORY_KEY } from '@module/product/application/repository/product.repository.interface';
import { ProductCrudUseCase } from '@module/product/application/use-cases/product-crud.use-case';
import { ProductPostgresRepository } from '@module/product/infrastructure/database/product.postgres.repository';
import { ProductSchema } from '@module/product/infrastructure/database/product.schema';
import { ProductController } from '@module/product/interface/product.controller';
import { Module, Provider } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

const productRepositoryProvider: Provider = {
  provide: PRODUCT_REPOSITORY_KEY,
  useClass: ProductPostgresRepository,
};

@Module({
  imports: [TypeOrmModule.forFeature([ProductSchema])],
  controllers: [ProductController],
  providers: [ProductCrudUseCase, productRepositoryProvider],
  exports: [ProductCrudUseCase],
})
export class ProductModule {}
