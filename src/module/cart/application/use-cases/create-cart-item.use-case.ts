import { CartItemDto } from '@module/cart/application/dto/cart-item.dto';
import { CreateCartItemDto } from '@module/cart/application/dto/create-cart-item.dto';
import { CartItemMapper } from '@module/cart/application/mapper/cart-item.mapper';
import { CartItemService } from '@module/cart/application/service/cart-item.service';
import { CartService } from '@module/cart/application/service/cart.service';
import { CartItem } from '@module/cart/domain/cart-item.entity';
import { ProductService } from '@module/product/application/service/product.service';
import { Injectable } from '@nestjs/common';

import { BaseResponseAdapter } from '@common/base/application/adapter/base-response.adapter';
import { OneSerializedResponseDto } from '@common/base/application/dto/one-serialized-response.dto';

@Injectable()
export class CreateCartItemUseCase {
  constructor(
    private readonly cartService: CartService,
    private readonly cartItemService: CartItemService,
    private readonly productService: ProductService,
    private readonly cartItemMapper: CartItemMapper,
    private readonly responseAdapter: BaseResponseAdapter,
  ) {}

  async execute(
    userId: string,
    createDto: CreateCartItemDto,
  ): Promise<OneSerializedResponseDto<CartItemDto>> {
    const cart = await this.cartService.getActiveCartOrCreateByUserId(userId);
    const product = await this.productService.getProductByIdOrFail(
      createDto.productId,
    );

    const cartItem = await this.cartItemService.createOrUpdateCartItem(
      cart,
      product,
      createDto,
    );

    return this.responseAdapter.oneEntityResponse(
      CartItem.getEntityName(),
      this.cartItemMapper.fromEntity<CartItemDto>(cartItem, {
        exclude: ['cart', 'product'],
      }),
    );
  }
}
