import { CartItemDto } from '@module/cart/application/dto/cart-item.dto';
import { CartDto } from '@module/cart/application/dto/cart.dto';
import { CreateCartItemDto } from '@module/cart/application/dto/create-cart-item.dto';
import { CartFieldsQueryParamsDto } from '@module/cart/application/dto/query-param/cart-fields-query-params.dto';
import { CartFilterQueryParamsDto } from '@module/cart/application/dto/query-param/cart-filter-query-params.dto';
import { UpdateCartItemDto } from '@module/cart/application/dto/update-cart-item.dto';
import { CreateCartItemPolicyHandler } from '@module/cart/application/policy/cart-item/create-cart-item.policy-handler';
import { DeleteCartItemPolicyHandler } from '@module/cart/application/policy/cart-item/delete-cart-item.policy-handler';
import { UpdateCartItemPolicyHandler } from '@module/cart/application/policy/cart-item/update-cart-item.policy-handler';
import { ReadAllCartPolicyHandler } from '@module/cart/application/policy/cart/read-all-cart.policy-handler';
import { ReadCartPolicyHandler } from '@module/cart/application/policy/cart/read-cart.policy-handler';
import { CartCrudUseCase } from '@module/cart/application/use-cases/cart-crud.use-case';
import { CreateCartItemUseCase } from '@module/cart/application/use-cases/create-cart-item.use-case';
import { DeleteCartItemUseCase } from '@module/cart/application/use-cases/delete-cart-item.use-case';
import { GetActiveCartUseCase } from '@module/cart/application/use-cases/get-active-cart.use.case';
import { UpdateCartItemtUseCase } from '@module/cart/application/use-cases/update-cart-item.use-case';
import { CurrentUser } from '@module/iam/authentication/infrastructure/decorator/current-user.decorator';
import { Policies } from '@module/iam/authorization/infrastructure/policy/decorator/policy.decorator';
import { PolicyGuard } from '@module/iam/authorization/infrastructure/policy/guard/policy.guard';
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
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { ManySerializedResponseDto } from '@common/base/application/dto/many-serialized-response.dto';
import { OneSerializedResponseDto } from '@common/base/application/dto/one-serialized-response.dto';
import { PageQueryParamsDto } from '@common/base/application/dto/query-param/page-query-params.dto';
import { SortOptions } from '@common/base/get-all-options.interface';
import { GetAllSwaggerDecorator } from '@common/base/interface/getAllSwaggerDecorator';

@Controller('cart')
@UseGuards(PolicyGuard)
@ApiTags('cart')
export class CartController {
  constructor(
    private readonly crudUseCase: CartCrudUseCase,
    private readonly getActiveCartUseCase: GetActiveCartUseCase,
    private readonly updateCartItemtUseCase: UpdateCartItemtUseCase,
    private readonly createCartItemUseCase: CreateCartItemUseCase,
    private readonly deleteCartItemUseCase: DeleteCartItemUseCase,
  ) {}

  @Get()
  @Policies(ReadAllCartPolicyHandler)
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
  @Policies(ReadCartPolicyHandler)
  async getActiveCart(
    @CurrentUser() user: User,
  ): Promise<OneSerializedResponseDto<CartDto>> {
    return this.getActiveCartUseCase.execute(user.id);
  }

  @Post('item')
  @Policies(CreateCartItemPolicyHandler)
  async createCartItem(
    @CurrentUser() user: User,
    @Body() createDto: CreateCartItemDto,
  ): Promise<OneSerializedResponseDto<CartItemDto>> {
    return this.createCartItemUseCase.execute(user.id, createDto);
  }

  @Patch('item/:id')
  @Policies(UpdateCartItemPolicyHandler)
  async updateCartItem(
    @Param('id') id: string,
    @Body() updateDto: UpdateCartItemDto,
    @CurrentUser() user: User,
  ): Promise<OneSerializedResponseDto<CartItemDto>> {
    return this.updateCartItemtUseCase.execute(id, updateDto, user.id);
  }

  @Delete('item/:id')
  @Policies(DeleteCartItemPolicyHandler)
  async deleteCartItem(
    @CurrentUser() user: User,
    @Param('id') id: string,
  ): Promise<void> {
    return this.deleteCartItemUseCase.execute(user.id, id);
  }
}
