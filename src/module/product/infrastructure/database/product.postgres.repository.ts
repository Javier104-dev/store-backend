import { Product } from '@module/product/domain/product.entity';
import { ProductSchema } from '@module/product/infrastructure/database/product.schema';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ICollection } from '@common/base/application/dto/collection.interface';
import { IGetAllOptions } from '@common/base/get-all-options.interface';
import BaseRepository from '@common/base/infrastructure/database/base.repository';

@Injectable()
export class ProductPostgresRepository extends BaseRepository<Product> {
  constructor(
    @InjectRepository(ProductSchema)
    protected readonly repository: Repository<Product>,
  ) {
    super(repository);
  }

  async getAllProductsByCategoryId(
    categoryId: string,
    options: IGetAllOptions<Product>,
  ): Promise<ICollection<Product>> {
    const { page, sort } = options || {};

    const [items, itemCount] = await this.repository.findAndCount({
      where: {
        categories: {
          id: categoryId,
        },
      },
      order: sort,
      take: page.size,
      skip: page.offset,
    });

    return {
      data: items,
      pageNumber: page.number,
      pageSize: page.size,
      pageCount: Math.ceil(itemCount / page.size),
      itemCount,
    };
  }
}
