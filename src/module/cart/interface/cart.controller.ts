import { CartItemDto } from '@module/cart/application/dto/cart-item.dto';
import { CartDto } from '@module/cart/application/dto/cart.dto';
import { CreateCartItemDto } from '@module/cart/application/dto/create-cart-item.dto';
import { CartFieldsQueryParamsDto } from '@module/cart/application/dto/query-param/cart-fields-query-params.dto';
import { CartFilterQueryParamsDto } from '@module/cart/application/dto/query-param/cart-filter-query-params.dto';
import { UpdateCartItemDto } from '@module/cart/application/dto/update-cart-item.dto';
import { CartCrudUseCase } from '@module/cart/application/use-cases/cart-crud.use-case';
import { CreateCartItemUseCase } from '@module/cart/application/use-cases/create-cart-item.use-case';
import { GetActiveCartUseCase } from '@module/cart/application/use-cases/get-active-cart.use.case';
import { UpdateCartItemtUseCase } from '@module/cart/application/use-cases/update-cart-item.use-case';
import { CurrentUser } from '@module/iam/authentication/infrastructure/decorator/current-user.decorator';
import { User } from '@module/iam/user/domain/user.entity';
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
  constructor(
    private readonly crudUseCase: CartCrudUseCase,
    private readonly getActiveCartUseCase: GetActiveCartUseCase,
    private readonly updateCartItemtUseCase: UpdateCartItemtUseCase,
    private readonly createCartItemUseCase: CreateCartItemUseCase,
  ) {}

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

  @Get('user')
  async getActiveCart(
    @CurrentUser() user: User,
  ): Promise<OneSerializedResponseDto<CartDto>> {
    return this.getActiveCartUseCase.execute(user.id);
  }

  @Get(':id')
  async getOneByIdOrFail(
    @Param('id') id: string,
  ): Promise<OneSerializedResponseDto<CartDto>> {
    return this.crudUseCase.getOneByIdOrFail(id);
  }

  @Post('cart-item')
  async createCartItem(
    @CurrentUser() user: User,
    @Body() createDto: CreateCartItemDto,
  ): Promise<OneSerializedResponseDto<CartItemDto>> {
    return this.createCartItemUseCase.execute(user.id, createDto);
  }

  @Patch(':id')
  async updateCartItem(
    @Param('id') id: string,
    @Body() updateDto: UpdateCartItemDto,
    @CurrentUser() user: User,
  ): Promise<OneSerializedResponseDto<CartItemDto>> {
    return this.updateCartItemtUseCase.execute(id, updateDto, user.id);
  }

  @Delete(':id')
  async deleteOneOrFail(@Param('id') id: string): Promise<void> {
    return this.crudUseCase.deleteOneOrFail(id);
  }
}
