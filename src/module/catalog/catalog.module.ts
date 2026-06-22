import { CatalogService } from '@module/catalog/application/service/catalog.service';
import { CreateProductUseCase } from '@module/catalog/application/use-cases/create-product.use-case';
import { GetAllCategoriesWithProductsUseCase } from '@module/catalog/application/use-cases/get-all-categories-with-products.use-case';
import { UpdateProductUseCase } from '@module/catalog/application/use-cases/update-product.use-case';
import { CatalogController } from '@module/catalog/interface/catalog.controller';
import { CategoryMapper } from '@module/category/application/mapper/category.mapper';
import { CategoryModule } from '@module/category/category.module';
import { ProductMapper } from '@module/product/application/mapper/product.mapper';
import { ProductModule } from '@module/product/product.module';
import { StoreModule } from '@module/store/store.module';
import { UploadModule } from '@module/upload/upload.module';
import { Module } from '@nestjs/common';

@Module({
  imports: [StoreModule, ProductModule, CategoryModule, UploadModule],
  controllers: [CatalogController],
  providers: [
    GetAllCategoriesWithProductsUseCase,
    CreateProductUseCase,
    UpdateProductUseCase,
    CatalogService,
    ProductMapper,
    CategoryMapper,
  ],
})
export class CatalogModule {}
