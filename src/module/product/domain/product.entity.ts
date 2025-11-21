import { Category } from '@module/category/domain/category.entity';
import { User } from '@sentry/nestjs';

import { Base } from '@common/base/domain/base.entity';

export class Product extends Base {
  name: string;

  price: number;

  description: string;

  storeId?: string;

  store?: User;

  categories?: Category[];
}
