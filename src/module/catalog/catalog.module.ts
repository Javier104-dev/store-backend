import { CatalogCrudUseCase } from '@module/catalog/application/use-cases/catalog-crud.use-case';
import { CatalogController } from '@module/catalog/interface/catalog.controller';
import { CategoryMapper } from '@module/category/application/mapper/category.mapper';
import { CategoryModule } from '@module/category/category.module';
import { ProductMapper } from '@module/product/application/mapper/product.mapper';
import { ProductModule } from '@module/product/product.module';
import { StoreModule } from '@module/store/store.module';
import { UploadMapper } from '@module/upload/application/mapper/upload.mapper';
import { UploadModule } from '@module/upload/upload.module';
import { Module } from '@nestjs/common';

@Module({
  imports: [StoreModule, ProductModule, CategoryModule, UploadModule],
  controllers: [CatalogController],
  providers: [CatalogCrudUseCase, ProductMapper, CategoryMapper, UploadMapper],
})
export class CatalogModule {}
