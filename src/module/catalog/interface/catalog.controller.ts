import { ProductsQueryParamsDto } from '@module/catalog/application/dto/query-param/product-limit-query-params.dto';
import { CatalogCrudUseCase } from '@module/catalog/application/use-cases/catalog-crud.use-case';
import { CategoryDto } from '@module/category/application/dto/category.dto';
import { CurrentUser } from '@module/iam/authentication/infrastructure/decorator/current-user.decorator';
import { User } from '@module/iam/user/domain/user.entity';
import { CreateProductDto } from '@module/product/application/dto/create-product.dto';
import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { ManySerializedResponseDto } from '@common/base/application/dto/many-serialized-response.dto';
import { PageQueryParamsDto } from '@common/base/application/dto/query-param/page-query-params.dto';
import { SortOptions } from '@common/base/get-all-options.interface';

@Controller('catalog')
@ApiTags('catalog')
export class CatalogController {
  constructor(private readonly crudUseCase: CatalogCrudUseCase) {}

  @Get('category')
  async getAllCategoriesWithProducts(
    @Query('page') page: PageQueryParamsDto,
    @Query('sort') sort: SortOptions<CategoryDto>,
    @Query('products') products: ProductsQueryParamsDto,
  ): Promise<ManySerializedResponseDto<CategoryDto>> {
    return this.crudUseCase.getAllCategoriesWithProducts(
      products.productsLimit,
      {
        page,
        sort,
      },
    );
  }

  @Post('product')
  async saveOne(
    @Body() createDto: CreateProductDto,
    @CurrentUser() user: User,
  ): Promise<any> {
    return this.crudUseCase.saveOneProduct(createDto, user.id);
  }
}
