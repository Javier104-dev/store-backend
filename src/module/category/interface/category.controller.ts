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

import { CategoryDto } from '../application/dto/category.dto';
import { CreateCategoryDto } from '../application/dto/create-category.dto';
import { CategoryFieldsQueryParamsDto } from '../application/dto/query-param/category-fields-query-params.dto';
import { CategoryFilterQueryParamsDto } from '../application/dto/query-param/category-filter-query-param.dto';
import { UpdateCategoryDto } from '../application/dto/update-category.dto';
import { CategoryCrudUseCase } from '../application/use-cases/category-crud.use-case';

@Controller('category')
@ApiTags('category')
export class CategoryController {
  constructor(private readonly crudUseCase: CategoryCrudUseCase) {}

  @Get()
  async getAll(
    @Query('page') page: PageQueryParamsDto,
    @Query('filter') filter: CategoryFilterQueryParamsDto,
    @Query('fields') fields: CategoryFieldsQueryParamsDto,
    @Query('sort') sort: SortOptions<CategoryDto>,
  ): Promise<ManySerializedResponseDto<CategoryDto>> {
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
  ): Promise<OneSerializedResponseDto<CategoryDto>> {
    return this.crudUseCase.getOneByIdOrFail(id);
  }

  @Post()
  async saveOne(
    @Body() createDto: CreateCategoryDto,
  ): Promise<OneSerializedResponseDto<CategoryDto>> {
    return this.crudUseCase.saveOne(createDto);
  }

  @Patch(':id')
  async updateOneOrFail(
    @Param('id') id: string,
    @Body() updateDto: UpdateCategoryDto,
  ): Promise<OneSerializedResponseDto<CategoryDto>> {
    return this.crudUseCase.updateOneOrFail(id, updateDto);
  }

  @Delete(':id')
  async deleteOneOrFail(@Param('id') id: string): Promise<void> {
    return this.crudUseCase.deleteOneOrFail(id);
  }
}
