import { Category } from '@module/category/domain/category.entity';
import { User } from '@module/iam/user/domain/user.entity';

import { Base } from '@common/base/domain/base.entity';

export class Product extends Base {
  name: string;

  price: number;

  description: string;

  sellerId?: string;

  user?: User;

  categories?: Category[];
}
