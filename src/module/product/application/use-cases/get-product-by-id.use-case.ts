import { ProductDto } from '@module/product/application/dto/product.dto';
import { ProductService } from '@module/product/application/service/product.service';
import { Product } from '@module/product/domain/product.entity';
import { UploadService } from '@module/upload/application/service/upload.service';
import { Injectable } from '@nestjs/common';

import { OneSerializedResponseDto } from '@common/base/application/dto/one-serialized-response.dto';
import { IGetOneOptions } from '@common/base/get-all-options.interface';

@Injectable()
export class GetProductByIdUseCase {
  constructor(
    private readonly productService: ProductService,
    private readonly uploadService: UploadService,
  ) {}

  async execute(id: string): Promise<OneSerializedResponseDto<ProductDto>> {
    const options: IGetOneOptions<Product> = {
      relations: ['categories', 'upload'],
    };

    return this.productService.findOneByIdOrFail(
      id,
      options,
      this.uploadService.transformUploadIncluded(),
    );
  }
}
