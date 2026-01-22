import { Category } from '@module/category/domain/category.entity';
import { Store } from '@module/store/domain/store.entity';

import { Base } from '@common/base/domain/base.entity';

export class Product extends Base {
  name: string;

  price: number;

  description: string;

  store?: Store;

  categories?: Category[];
}
