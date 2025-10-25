import { Module, Provider } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { PRODUCT_REPOSITORY_KEY } from './application/repository/product.repository.interface';
import { ProductCrudUseCase } from './application/use-cases/product-crud.use-case';
import { ProductPostgresRepository } from './infrastructure/database/product.postgres.repository';
import { ProductSchema } from './infrastructure/database/product.schema';
import { ProductController } from './interface/product.controller';

const productRepositoryProvider: Provider = {
  provide: PRODUCT_REPOSITORY_KEY,
  useClass: ProductPostgresRepository,
};

@Module({
  imports: [TypeOrmModule.forFeature([ProductSchema])],
  controllers: [ProductController],
  providers: [ProductCrudUseCase, productRepositoryProvider],
})
export class ProductModule {}
