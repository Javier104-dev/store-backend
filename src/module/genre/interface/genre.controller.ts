import { Policies } from '@module/iam/authorization/infrastructure/policy/decorator/policy.decorator';
import { PolicyGuard } from '@module/iam/authorization/infrastructure/policy/guard/policy.guard';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { ManySerializedResponseDto } from '@common/base/application/dto/many-serialized-response.dto';
import { OneSerializedResponseDto } from '@common/base/application/dto/one-serialized-response.dto';
import { PageQueryParamsDto } from '@common/base/application/dto/query-param/page-query-params.dto';
import { SortOptions } from '@common/base/get-all-options.interface';
import { GetAllSwaggerDecorator } from '@common/base/interface/getAllSwaggerDecorator';

import { CreateGenreDto } from '@/module/genre/application/dto/create-genre.dto';
import { GenreDto } from '@/module/genre/application/dto/genre.dto';
import { GenreFieldsQueryParamsDto } from '@/module/genre/application/dto/query-param/genre-fields-query-params.dto';
import { GenreFilterQueryParamsDto } from '@/module/genre/application/dto/query-param/genre-filter-query-params.dto';
import { UpdateGenreDto } from '@/module/genre/application/dto/update-genre.dto';
import { CreateGenrePolicyHandler } from '@/module/genre/application/policy/create-genre.policy-handler';
import { DeleteGenrePolicyHandler } from '@/module/genre/application/policy/delete-genre.policy-handler';
import { ReadGenrePolicyHandler } from '@/module/genre/application/policy/read-genre.policy-handler';
import { UpdateGenrePolicyHandler } from '@/module/genre/application/policy/update-genre.policy-handler';
import { GenreCrudUseCase } from '@/module/genre/application/use-cases/genre-crud.use-case';

@Controller('genre')
@UseGuards(PolicyGuard)
@ApiTags('genre')
export class GenreController {
  constructor(private readonly crudUseCase: GenreCrudUseCase) {}

  @Get()
  @Policies(ReadGenrePolicyHandler)
  @GetAllSwaggerDecorator(
    GenreDto,
    GenreFilterQueryParamsDto,
    GenreFieldsQueryParamsDto,
  )
  async getAll(
    @Query('page') page: PageQueryParamsDto,
    @Query('filter') filter: GenreFilterQueryParamsDto,
    @Query('fields') fields: GenreFieldsQueryParamsDto,
    @Query('sort') sort: SortOptions<GenreDto>,
  ): Promise<ManySerializedResponseDto<GenreDto>> {
    return this.crudUseCase.getAll({
      page,
      filter,
      fields: fields.target,
      sort,
    });
  }

  @Get(':id')
  @Policies(ReadGenrePolicyHandler)
  async getOneByIdOrFail(
    @Param('id') id: string,
  ): Promise<OneSerializedResponseDto<GenreDto>> {
    return this.crudUseCase.getOneByIdOrFail(id);
  }

  @Post()
  @Policies(CreateGenrePolicyHandler)
  async saveOne(
    @Body() createDto: CreateGenreDto,
  ): Promise<OneSerializedResponseDto<GenreDto>> {
    return this.crudUseCase.saveOne(createDto);
  }

  @Patch(':id')
  @Policies(UpdateGenrePolicyHandler)
  async updateOneOrFail(
    @Param('id') id: string,
    @Body() updateDto: UpdateGenreDto,
  ): Promise<OneSerializedResponseDto<GenreDto>> {
    return this.crudUseCase.updateOneOrFail(id, updateDto);
  }

  @Delete(':id')
  @Policies(DeleteGenrePolicyHandler)
  async deleteOneOrFail(@Param('id') id: string): Promise<void> {
    return this.crudUseCase.deleteOneOrFail(id);
  }
}
