import { CreateCartItemDto } from '@module/cart/application/dto/create-cart-item.dto';
import { UpdateCartItemDto } from '@module/cart/application/dto/update-cart-item.dto';
import { CartItemMapper } from '@module/cart/application/mapper/cart-item.mapper';
import {
  CART_ITEM_REPOSITORY_KEY,
  ICartItemRepository,
} from '@module/cart/application/repository/cart-item.repository.interface';
import { CartItem } from '@module/cart/domain/cart-item.entity';
import { Cart } from '@module/cart/domain/cart.entity';
import { CartItemNotFoundException } from '@module/cart/infrastructure/exception/cart-item-not-found.exception';
import { Product } from '@module/product/domain/product.entity';
import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class CartItemService {
  constructor(
    @Inject(CART_ITEM_REPOSITORY_KEY)
    private readonly repository: ICartItemRepository,
    private readonly cartItemMapper: CartItemMapper,
  ) {}

  async getActiveCartItemByUserOrFail(
    cartItemId: string,
    userId: string,
  ): Promise<CartItem> {
    const cartItem = await this.repository.getActiveCartItemByUser(
      cartItemId,
      userId,
    );

    if (!cartItem) {
      throw new CartItemNotFoundException({
        message: `Cart item with id ${cartItemId} not found`,
      });
    }

    return cartItem;
  }

  async updateCartItem(
    cartItemId: string,
    updateDto: UpdateCartItemDto,
  ): Promise<CartItem> {
    return this.repository.updateOneOrFail(
      cartItemId,
      this.cartItemMapper.toEntity<CartItem>(updateDto),
    );
  }

  async createCartItem(
    cart: Cart,
    product: Product,
    createDto: CreateCartItemDto,
  ): Promise<CartItem> {
    const cartItem = this.cartItemMapper.toEntity<CartItem>({
      ...createDto,
      unitPrice: product.price,
      cart,
      product,
    });
    return this.repository.saveOne(cartItem);
  }
}
