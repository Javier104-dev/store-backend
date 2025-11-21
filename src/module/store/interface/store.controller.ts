import { CreateStoreDto } from '@module/store/application/dto/create-store.dto';
import { StoreDto } from '@module/store/application/dto/store.dto';
import { UpdateStoreDto } from '@module/store/application/dto/upate-store.dto';
import { StoreFieldsQueryParamsDto } from '@module/store/application/query-param/store-fields-query-params.dto';
import { StoreFilterQueryParamsDto } from '@module/store/application/query-param/store-filter-query-params.dto';
import { StoreCrudUseCase } from '@module/store/application/use-cases/store-crud.use-case';
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

@Controller('store')
@ApiTags('store')
export class StoreController {
  constructor(private readonly crudUseCase: StoreCrudUseCase) {}

  @Get()
  async getAll(
    @Query('page') page: PageQueryParamsDto,
    @Query('filter') filter: StoreFilterQueryParamsDto,
    @Query('fields') fields: StoreFieldsQueryParamsDto,
    @Query('sort') sort: SortOptions<StoreDto>,
  ): Promise<ManySerializedResponseDto<StoreDto>> {
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
  ): Promise<OneSerializedResponseDto<StoreDto>> {
    return this.crudUseCase.getOneByIdOrFail(id);
  }

  @Post()
  async saveOne(
    @Body() createDto: CreateStoreDto,
  ): Promise<OneSerializedResponseDto<StoreDto>> {
    return this.crudUseCase.saveOne(createDto);
  }

  @Patch(':id')
  async updateOneOrFail(
    @Param('id') id: string,
    @Body() updateDto: UpdateStoreDto,
  ): Promise<OneSerializedResponseDto<StoreDto>> {
    return this.crudUseCase.updateOneOrFail(id, updateDto);
  }

  @Delete(':id')
  async deleteOneOrFail(@Param('id') id: string): Promise<void> {
    return this.crudUseCase.deleteOneOrFail(id);
  }
}
