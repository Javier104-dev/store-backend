import { Base } from "@common/base/domain/base.entity";
import { Product } from "@module/product/domain/product.entity";

export class Category extends Base {
  name: string;

  products?: Product[]
}