import { CartItem } from '@module/cart/domain/cart-item.entity';
import { CartStatus } from '@module/cart/domain/cart-status';
import { User } from '@module/iam/user/domain/user.entity';

import { Base } from '@common/base/domain/base.entity';

export class Cart extends Base {
  status: CartStatus;

  user: User;

  items: CartItem[];
}
