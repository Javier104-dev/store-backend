import { Product } from '@module/product/domain/product.entity';

import { Base } from '@common/base/domain/base.entity';

export class Category extends Base {
  name: string;

  products?: Product[];
}
