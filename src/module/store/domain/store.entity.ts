import { User } from '@module/iam/user/domain/user.entity';
import { Product } from '@module/product/domain/product.entity';

import { Base } from '@common/base/domain/base.entity';

export class Store extends Base {
  name: string;

  ownerId?: string;

  owner?: User;

  products?: Product[];
}
