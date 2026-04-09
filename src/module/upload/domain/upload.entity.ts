import { Product } from '@module/product/domain/product.entity';

import { Base } from '@common/base/domain/base.entity';

export class Upload extends Base {
  key: string;
  product: Product;
}
