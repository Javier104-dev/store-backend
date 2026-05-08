import { AuthType } from '@module/iam/authentication/domain/auth-type.enum';
import { Auth } from '@module/iam/authentication/infrastructure/decorator/auth.decorator';
import { CurrentUser } from '@module/iam/authentication/infrastructure/decorator/current-user.decorator';
import { Policies } from '@module/iam/authorization/infrastructure/policy/decorator/policy.decorator';
import { PolicyGuard } from '@module/iam/authorization/infrastructure/policy/guard/policy.guard';
import { User } from '@module/iam/user/domain/user.entity';
import { ProductDto } from '@module/product/application/dto/product.dto';
import { ProductFieldsQueryParamsDto } from '@module/product/application/dto/query-param/product-fields-query-params.dto';
import { ProductFilterQueryParamsDto } from '@module/product/application/dto/query-param/product-filter-query-params.dto';
import { DeleteProductPolicyHandler } from '@module/product/application/policy/delete-product.policy-handler';
import { ReadProductPolicyHandler } from '@module/product/application/policy/read-product.policy-handler';
import { ProductCrudUseCase } from '@module/product/application/use-cases/product-crud.use-case';
import {
  Controller,
  Delete,
  Get,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { ManySerializedResponseDto } from '@common/base/application/dto/many-serialized-response.dto';
import { OneSerializedResponseDto } from '@common/base/application/dto/one-serialized-response.dto';
import { PageQueryParamsDto } from '@common/base/application/dto/query-param/page-query-params.dto';
import { SortOptions } from '@common/base/get-all-options.interface';

@Controller('product')
@UseGuards(PolicyGuard)
@ApiTags('product')
export class ProductController {
  constructor(private readonly crudUseCase: ProductCrudUseCase) {}

  @Get()
  @Auth(AuthType.None)
  async getAll(
    @Query('page') page: PageQueryParamsDto,
    @Query('filter') filter: ProductFilterQueryParamsDto,
    @Query('fields') fields: ProductFieldsQueryParamsDto,
    @Query('sort') sort: SortOptions<ProductDto>,
  ): Promise<ManySerializedResponseDto<ProductDto>> {
    return this.crudUseCase.getAllProducts({
      page,
      filter,
      fields: fields.target,
      sort,
    });
  }

  @Get('owner')
  @Policies(ReadProductPolicyHandler)
  async getProductsFromOwner(
    @CurrentUser() user: User,
    @Query('page') page: PageQueryParamsDto,
    @Query('filter') filter: ProductFilterQueryParamsDto,
    @Query('fields') fields: ProductFieldsQueryParamsDto,
    @Query('sort') sort: SortOptions<ProductDto>,
  ): Promise<ManySerializedResponseDto<ProductDto>> {
    return this.crudUseCase.getProductsFromOwner(user, {
      page,
      filter,
      fields: fields.target,
      sort,
    });
  }

  @Get('owner/:id')
  @Policies(ReadProductPolicyHandler)
  async findOneByOwnerOrFail(
    @CurrentUser() user: User,
    @Param('id') id: string,
  ): Promise<OneSerializedResponseDto<ProductDto>> {
    return this.crudUseCase.findOneByOwnerOrFail(user, id);
  }

  @Get(':id')
  @Auth(AuthType.None)
  async getOneByIdOrFail(
    @Param('id') id: string,
  ): Promise<OneSerializedResponseDto<ProductDto>> {
    return this.crudUseCase.getOneByIdOrFail(id);
  }

  @Delete(':id')
  @Policies(DeleteProductPolicyHandler)
  async deleteOneOrFail(@Param('id') id: string): Promise<void> {
    return this.crudUseCase.deleteOneOrFail(id);
  }
}
