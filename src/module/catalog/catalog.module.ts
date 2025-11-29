import { CatalogMapper } from '@module/catalog/application/mapper/catalog.mapper';
import { CatalogCrudUseCase } from '@module/catalog/application/use-cases/catalog-crud.use-case';
import { CatalogController } from '@module/catalog/interface/catalog.controller';
import { CategoryModule } from '@module/category/category.module';
import { ProductModule } from '@module/product/product.module';
import { StoreMapper } from '@module/store/application/mapper/store.mapper';
import { StoreModule } from '@module/store/store.module';
import { Module } from '@nestjs/common';

@Module({
  imports: [StoreModule, ProductModule, CategoryModule],
  controllers: [CatalogController],
  providers: [CatalogCrudUseCase, CatalogMapper, StoreMapper],
})
export class CatalogModule {}
