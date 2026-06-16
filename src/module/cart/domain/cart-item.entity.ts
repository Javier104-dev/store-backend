import { Cart } from '@module/cart/domain/cart.entity';
import { Product } from '@module/product/domain/product.entity';

import { Base } from '@common/base/domain/base.entity';

export class CartItem extends Base {
  quantity: number;

  unitPrice: string;

  cart: Cart;

  product: Product;
}
