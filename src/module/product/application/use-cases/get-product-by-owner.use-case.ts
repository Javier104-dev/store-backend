import { User } from '@module/iam/user/domain/user.entity';
import { ProductDto } from '@module/product/application/dto/product.dto';
import { ProductService } from '@module/product/application/service/product.service';
import { Product } from '@module/product/domain/product.entity';
import { StoreService } from '@module/store/application/service/store.service';
import { Injectable } from '@nestjs/common';

import { OneSerializedResponseDto } from '@common/base/application/dto/one-serialized-response.dto';
import { IGetOneOptions } from '@common/base/get-all-options.interface';

@Injectable()
export class GetProductByOwnerUseCase {
  constructor(
    private readonly productService: ProductService,
    private readonly storeService: StoreService,
  ) {}

  async execute(
    user: User,
    id: string,
  ): Promise<OneSerializedResponseDto<ProductDto>> {
    const store = await this.storeService.getStoreFromUserIdOrFail(user.id);

    const options: IGetOneOptions<Product> = {
      filter: { store: { id: store.id } },
      relations: ['categories'],
    };

    return this.productService.findOneByIdOrFail(id, options);
  }
}
