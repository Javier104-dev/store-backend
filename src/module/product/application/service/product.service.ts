import {
  IProductRepository,
  PRODUCT_REPOSITORY_KEY,
} from '@module/product/application/repository/product.repository.interface';
import { Product } from '@module/product/domain/product.entity';
import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class ProductService {
  constructor(
    @Inject(PRODUCT_REPOSITORY_KEY)
    private readonly repository: IProductRepository,
  ) {}

  async getProductsByIds(productIds: string[]): Promise<Product[]> {
    return this.repository.getProductsByIds(productIds);
  }
}
