import { ProductsQueryParamsDto } from '@module/catalog/application/dto/query-param/product-limit-query-params.dto';
import { CatalogCrudUseCase } from '@module/catalog/application/use-cases/catalog-crud.use-case';
import { CategoryDto } from '@module/category/application/dto/category.dto';
import { AuthType } from '@module/iam/authentication/domain/auth-type.enum';
import { Auth } from '@module/iam/authentication/infrastructure/decorator/auth.decorator';
import { CurrentUser } from '@module/iam/authentication/infrastructure/decorator/current-user.decorator';
import { User } from '@module/iam/user/domain/user.entity';
import { CreateProductDto } from '@module/product/application/dto/create-product.dto';
import { ProductDto } from '@module/product/application/dto/product.dto';
import { UpdateProductDto } from '@module/product/application/dto/update-product.dto';
import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { ManySerializedResponseDto } from '@common/base/application/dto/many-serialized-response.dto';
import { OneSerializedResponseDto } from '@common/base/application/dto/one-serialized-response.dto';
import { PageQueryParamsDto } from '@common/base/application/dto/query-param/page-query-params.dto';
import { SortOptions } from '@common/base/get-all-options.interface';

@Controller('catalog')
@ApiTags('catalog')
export class CatalogController {
  constructor(private readonly crudUseCase: CatalogCrudUseCase) {}

  @Get('category')
  @Auth(AuthType.None)
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
  ): Promise<OneSerializedResponseDto<ProductDto>> {
    return this.crudUseCase.saveOneProduct(createDto, user.id);
  }

  @Patch('product/:id')
  async updateOneOrFail(
    @Param('id') id: string,
    @Body() updateDto: UpdateProductDto,
  ): Promise<OneSerializedResponseDto<ProductDto>> {
    return this.crudUseCase.updateOneOrFail(id, updateDto);
  }
}
