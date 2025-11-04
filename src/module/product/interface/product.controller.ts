import { CurrentUser } from '@module/iam/authentication/infrastructure/decorator/current-user.decorator';
import { CreateProductDto } from '@module/product/application/dto/create-product.dto';
import { ProductDto } from '@module/product/application/dto/product.dto';
import { ProductFieldsQueryParamsDto } from '@module/product/application/dto/query-param/product-fields-query-params.dto';
import { ProductFilterQueryParamsDto } from '@module/product/application/dto/query-param/product-filter-query-params.dto';
import { UpdateProductDto } from '@module/product/application/dto/update-product.dto';
import { ProductCrudUseCase } from '@module/product/application/use-cases/product-crud.use-case';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { User } from '@sentry/nestjs';

import { ManySerializedResponseDto } from '@common/base/application/dto/many-serialized-response.dto';
import { OneSerializedResponseDto } from '@common/base/application/dto/one-serialized-response.dto';
import { PageQueryParamsDto } from '@common/base/application/dto/query-param/page-query-params.dto';
import { SortOptions } from '@common/base/get-all-options.interface';

@Controller('product')
@ApiTags('product')
export class ProductController {
  constructor(private readonly crudUseCase: ProductCrudUseCase) {}

  @Get('category/:categoryId')
  async getAllProductsByCategoryId(
    @Query('page') page: PageQueryParamsDto,
    @Query('sort') sort: SortOptions<ProductDto>,
    @Param('categoryId') categoryId: string,
  ): Promise<ManySerializedResponseDto<ProductDto>> {
    return this.crudUseCase.getAllProductsByCategoryId(categoryId, {
      page,
      sort,
    });
  }

  @Get()
  async getAll(
    @Query('page') page: PageQueryParamsDto,
    @Query('filter') filter: ProductFilterQueryParamsDto,
    @Query('fields') fields: ProductFieldsQueryParamsDto,
    @Query('sort') sort: SortOptions<ProductDto>,
  ): Promise<ManySerializedResponseDto<ProductDto>> {
    return this.crudUseCase.getAll({
      page,
      filter,
      fields: fields.target,
      sort,
    });
  }

  @Get(':id')
  async getOneByIdOrFail(
    @Param('id') id: string,
  ): Promise<OneSerializedResponseDto<ProductDto>> {
    return this.crudUseCase.getOneByIdOrFail(id);
  }

  @Post()
  async saveOne(
    @Body() createDto: CreateProductDto,
    @CurrentUser() user: User,
  ): Promise<any> {
    const productToSave = {
      ...createDto,
      storeId: user.id,
    };

    return this.crudUseCase.saveOne(productToSave);
  }

  @Patch(':id')
  async updateOneOrFail(
    @Param('id') id: string,
    @Body() updateDto: UpdateProductDto,
  ): Promise<OneSerializedResponseDto<ProductDto>> {
    return this.crudUseCase.updateOneOrFail(id, updateDto);
  }

  @Delete(':id')
  async deleteOneOrFail(@Param('id') id: string): Promise<void> {
    return this.crudUseCase.deleteOneOrFail(id);
  }
}
