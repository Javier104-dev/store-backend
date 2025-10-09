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

import { AuthorDto } from '@/module/author/application/dto/author.dto';
import { CreateAuthorDto } from '@/module/author/application/dto/create-author.dto';
import { AuthorFieldsQueryParamsDto } from '@/module/author/application/dto/query-param/author-fields-query-params.dto';
import { AuthorFilterQueryParamsDto } from '@/module/author/application/dto/query-param/author-filter-query-params.dto';
import { UpdateAuthorDto } from '@/module/author/application/dto/update-author.dto';
import { CreateAuthorPolicyHandler } from '@/module/author/application/policy/create-author.policy-handler';
import { DeleteAuthorPolicyHandler } from '@/module/author/application/policy/delete-author.policy-handler';
import { ReadAuthorPolicyHandler } from '@/module/author/application/policy/read-author.policy-handler';
import { UpdateAuthorPolicyHandler } from '@/module/author/application/policy/update-author.policy-handler';
import { AuthorCrudUseCase } from '@/module/author/application/use-cases/author-crud.use-case';

@Controller('author')
@UseGuards(PolicyGuard)
@ApiTags('author')
export class AuthorController {
  constructor(private readonly crudUseCase: AuthorCrudUseCase) {}

  @Get()
  @Policies(ReadAuthorPolicyHandler)
  @GetAllSwaggerDecorator(
    AuthorDto,
    AuthorFilterQueryParamsDto,
    AuthorFieldsQueryParamsDto,
  )
  async getAll(
    @Query('page') page: PageQueryParamsDto,
    @Query('filter') filter: AuthorFilterQueryParamsDto,
    @Query('fields') fields: AuthorFieldsQueryParamsDto,
    @Query('sort') sort: SortOptions<AuthorDto>,
  ): Promise<ManySerializedResponseDto<AuthorDto>> {
    return this.crudUseCase.getAll({
      page,
      filter,
      fields: fields.target,
      sort,
    });
  }

  @Get(':id')
  @Policies(ReadAuthorPolicyHandler)
  async getOneByIdOrFail(
    @Param('id') id: string,
  ): Promise<OneSerializedResponseDto<AuthorDto>> {
    return this.crudUseCase.getOneByIdOrFail(id);
  }

  @Post()
  @Policies(CreateAuthorPolicyHandler)
  async saveOne(
    @Body() createDto: CreateAuthorDto,
  ): Promise<OneSerializedResponseDto<AuthorDto>> {
    return this.crudUseCase.saveOne(createDto);
  }

  @Patch(':id')
  @Policies(UpdateAuthorPolicyHandler)
  async updateOneOrFail(
    @Param('id') id: string,
    @Body() updateDto: UpdateAuthorDto,
  ): Promise<OneSerializedResponseDto<AuthorDto>> {
    return this.crudUseCase.updateOneOrFail(id, updateDto);
  }

  @Delete(':id')
  @Policies(DeleteAuthorPolicyHandler)
  async deleteOneOrFail(@Param('id') id: string): Promise<void> {
    return this.crudUseCase.deleteOneOrFail(id);
  }
}
