import { CategoryDto } from '@module/category/application/dto/category.dto';
import { CreateCategoryDto } from '@module/category/application/dto/create-category.dto';
import { CategoryFieldsQueryParamsDto } from '@module/category/application/dto/query-param/category-fields-query-params.dto';
import { CategoryFilterQueryParamsDto } from '@module/category/application/dto/query-param/category-filter-query-param.dto';
import { UpdateCategoryDto } from '@module/category/application/dto/update-category.dto';
import { CreateCategoryPolicyHandler } from '@module/category/application/policy/create-category.policy-handler';
import { DeleteCategoryPolicyHandler } from '@module/category/application/policy/delete-category.policy-handler';
import { UpdateCategoryPolicyHandler } from '@module/category/application/policy/update-category.policy-handler';
import { CategoryCrudUseCase } from '@module/category/application/use-cases/category-crud.use-case';
import { AuthType } from '@module/iam/authentication/domain/auth-type.enum';
import { Auth } from '@module/iam/authentication/infrastructure/decorator/auth.decorator';
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

@Controller('category')
@UseGuards(PolicyGuard)
@ApiTags('category')
export class CategoryController {
  constructor(private readonly crudUseCase: CategoryCrudUseCase) {}

  @Get()
  @Auth(AuthType.None)
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
  @Auth(AuthType.None)
  async getOneByIdOrFail(
    @Param('id') id: string,
  ): Promise<OneSerializedResponseDto<CategoryDto>> {
    return this.crudUseCase.getOneByIdOrFail(id);
  }

  @Post()
  @Policies(CreateCategoryPolicyHandler)
  async saveOne(
    @Body() createDto: CreateCategoryDto,
  ): Promise<OneSerializedResponseDto<CategoryDto>> {
    return this.crudUseCase.saveOne(createDto);
  }

  @Patch(':id')
  @Policies(UpdateCategoryPolicyHandler)
  async updateOneOrFail(
    @Param('id') id: string,
    @Body() updateDto: UpdateCategoryDto,
  ): Promise<OneSerializedResponseDto<CategoryDto>> {
    return this.crudUseCase.updateOneOrFail(id, updateDto);
  }

  @Delete(':id')
  @Policies(DeleteCategoryPolicyHandler)
  async deleteOneOrFail(@Param('id') id: string): Promise<void> {
    return this.crudUseCase.deleteOneOrFail(id);
  }
}
