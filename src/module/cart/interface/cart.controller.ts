import { CreateBookDto } from '@module/book/application/dto/create-book.dto';
import { UpdateBookDto } from '@module/book/application/dto/update-book.dto';
import { CartDto } from '@module/cart/application/dto/cart.dto';
import { CartFieldsQueryParamsDto } from '@module/cart/application/dto/query-param/cart-fields-query-params.dto';
import { CartFilterQueryParamsDto } from '@module/cart/application/dto/query-param/cart-filter-query-params.dto';
import { CartCrudUseCase } from '@module/cart/application/use-cases/cart-crud.use-case';
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

import { ManySerializedResponseDto } from '@common/base/application/dto/many-serialized-response.dto';
import { OneSerializedResponseDto } from '@common/base/application/dto/one-serialized-response.dto';
import { PageQueryParamsDto } from '@common/base/application/dto/query-param/page-query-params.dto';
import { SortOptions } from '@common/base/get-all-options.interface';
import { GetAllSwaggerDecorator } from '@common/base/interface/getAllSwaggerDecorator';

@Controller('cart')
@ApiTags('cart')
export class CartController {
  constructor(private readonly crudUseCase: CartCrudUseCase) {}

  @Get()
  @GetAllSwaggerDecorator(
    CartDto,
    CartFilterQueryParamsDto,
    CartFieldsQueryParamsDto,
  )
  async getAll(
    @Query('page') page: PageQueryParamsDto,
    @Query('filter') filter: CartFilterQueryParamsDto,
    @Query('fields') fields: CartFieldsQueryParamsDto,
    @Query('sort') sort: SortOptions<CartDto>,
  ): Promise<ManySerializedResponseDto<CartDto>> {
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
  ): Promise<OneSerializedResponseDto<CartDto>> {
    return this.crudUseCase.getOneByIdOrFail(id);
  }

  @Post()
  async saveOne(
    @Body() createDto: CreateBookDto,
  ): Promise<OneSerializedResponseDto<CartDto>> {
    return this.crudUseCase.saveOne(createDto);
  }

  @Patch(':id')
  async updateOneOrFail(
    @Param('id') id: string,
    @Body() updateDto: UpdateBookDto,
  ): Promise<OneSerializedResponseDto<CartDto>> {
    return this.crudUseCase.updateOneOrFail(id, updateDto);
  }

  @Delete(':id')
  async deleteOneOrFail(@Param('id') id: string): Promise<void> {
    return this.crudUseCase.deleteOneOrFail(id);
  }
}
