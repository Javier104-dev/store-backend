import { ProductsPageQueryParamsDto } from '@module/catalog/application/dto/query-param/product-page-query-params.dto';
import { CreateProductUseCase } from '@module/catalog/application/use-cases/create-product.use-case';
import { GetAllCategoriesWithProductsUseCase } from '@module/catalog/application/use-cases/get-all-categories-with-products.use-case';
import { UpdateProductUseCase } from '@module/catalog/application/use-cases/update-product.use-case';
import { CategoryDto } from '@module/category/application/dto/category.dto';
import { AuthType } from '@module/iam/authentication/domain/auth-type.enum';
import { Auth } from '@module/iam/authentication/infrastructure/decorator/auth.decorator';
import { CurrentUser } from '@module/iam/authentication/infrastructure/decorator/current-user.decorator';
import { Policies } from '@module/iam/authorization/infrastructure/policy/decorator/policy.decorator';
import { PolicyGuard } from '@module/iam/authorization/infrastructure/policy/guard/policy.guard';
import { User } from '@module/iam/user/domain/user.entity';
import { CreateProductDto } from '@module/product/application/dto/create-product.dto';
import { ProductDto } from '@module/product/application/dto/product.dto';
import { UpdateProductDto } from '@module/product/application/dto/update-product.dto';
import { CreateProductPolicyHandler } from '@module/product/application/policy/create-product.policy-handler';
import { UpdateProductPolicyHandler } from '@module/product/application/policy/update-product.policy-handler';
import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';

import { ManySerializedResponseDto } from '@common/base/application/dto/many-serialized-response.dto';
import { OneSerializedResponseDto } from '@common/base/application/dto/one-serialized-response.dto';
import { PageQueryParamsDto } from '@common/base/application/dto/query-param/page-query-params.dto';
import { SortOptions } from '@common/base/get-all-options.interface';

@Controller('catalog')
@UseGuards(PolicyGuard)
@ApiTags('catalog')
export class CatalogController {
  constructor(
    private readonly getAllCategoriesWithProductsUseCase: GetAllCategoriesWithProductsUseCase,
    private readonly createProductUseCase: CreateProductUseCase,
    private readonly updateProductUseCase: UpdateProductUseCase,
  ) {}

  @Get('categories')
  @Auth(AuthType.None)
  @ApiResponse({
    status: 200,
    description: 'The operation has been successful.',
  })
  @ApiQuery({ name: 'page', required: false, type: () => PageQueryParamsDto })
  @ApiQuery({
    name: 'productPage',
    required: false,
    type: () => ProductsPageQueryParamsDto,
  })
  async getAllCategoriesWithProducts(
    @Query('page') page: PageQueryParamsDto,
    @Query('sort') sort: SortOptions<CategoryDto>,
    @Query('productPage') productPage: ProductsPageQueryParamsDto,
  ): Promise<ManySerializedResponseDto<CategoryDto>> {
    const test = await this.getAllCategoriesWithProductsUseCase.execute(
      productPage,
      {
        page,
        sort,
      },
    );
    return test;
  }

  @Post('product')
  @Policies(CreateProductPolicyHandler)
  @UseInterceptors(FilesInterceptor('images'))
  async saveOne(
    @Body() createDto: CreateProductDto,
    @CurrentUser() user: User,
    @UploadedFiles() files: Express.Multer.File[],
  ): Promise<OneSerializedResponseDto<ProductDto>> {
    return this.createProductUseCase.execute(createDto, user, files);
  }

  @Patch('product/:id')
  @Policies(UpdateProductPolicyHandler)
  @UseInterceptors(FilesInterceptor('images'))
  async updateOneOrFail(
    @Param('id') id: string,
    @Body() updateDto: UpdateProductDto,
    @CurrentUser() user: User,
    @UploadedFiles() files: Express.Multer.File[],
  ): Promise<OneSerializedResponseDto<ProductDto>> {
    return this.updateProductUseCase.execute(id, updateDto, user, files);
  }
}
