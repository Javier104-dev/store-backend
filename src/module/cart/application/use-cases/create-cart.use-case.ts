import { CartDto } from '@module/cart/application/dto/cart.dto';
import { CreateCartDto } from '@module/cart/application/dto/create-cart.dto';
import { CartItemMapper } from '@module/cart/application/mapper/cart-item.mapper';
import { CartMapper } from '@module/cart/application/mapper/cart.mapper';
import { CartItemService } from '@module/cart/application/service/cart-item.service';
import { CartService } from '@module/cart/application/service/cart.service';
import { CartItem } from '@module/cart/domain/cart-item.entity';
import { Cart } from '@module/cart/domain/cart.entity';
import { UserService } from '@module/iam/user/application/service/user.service';
import { ProductService } from '@module/product/application/service/product.service';
import { Injectable } from '@nestjs/common';

import { BaseResponseAdapter } from '@common/base/application/adapter/base-response.adapter';
import { OneSerializedResponseDto } from '@common/base/application/dto/one-serialized-response.dto';

@Injectable()
export class CreateCartUseCase {
  constructor(
    private readonly cartService: CartService,
    private readonly userService: UserService,
    private readonly productService: ProductService,
    private readonly cartItemService: CartItemService,
    private readonly cartMapper: CartMapper,
    private readonly cartItemMapper: CartItemMapper,
    private readonly responseAdapter: BaseResponseAdapter,
  ) {}

  async execute(
    userId: string,
    createDto: CreateCartDto,
  ): Promise<OneSerializedResponseDto<CartDto>> {
    const productIds = createDto.items.map((item) => item.productId);
    const user = await this.userService.getUserByIdOrFail(userId);
    const products = await this.productService.getProductsByIds(productIds);

    const cart = await this.cartService.saveCart(
      this.cartMapper.toEntity<Cart>({
        ...createDto,
        user,
      }),
    );

    if (products.length > 0) {
      const items = products.map((product) => {
        const itemDto = createDto.items.find((i) => i.productId === product.id);
        return this.cartItemMapper.toEntity<CartItem>({
          product,
          cart,
          quantity: itemDto.quantity,
          unitPrice: product.price,
        });
      });

      await this.cartItemService.saveManyItems(items);
    }

    return this.responseAdapter.oneEntityResponse<CartDto>(
      Cart.getEntityName(),
      this.cartMapper.fromEntity<CartDto>(cart, { exclude: ['user', 'items'] }),
    );
  }
}
