import { Product } from '@module/product/domain/product.entity';
import { ProductSchema } from '@module/product/infrastructure/database/product.schema';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ICollection } from '@common/base/application/dto/collection.interface';
import {
  IGetAllOptions,
  IGetOneOptions,
} from '@common/base/get-all-options.interface';
import BaseRepository from '@common/base/infrastructure/database/base.repository';

@Injectable()
export class ProductPostgresRepository extends BaseRepository<Product> {
  constructor(
    @InjectRepository(ProductSchema)
    protected readonly repository: Repository<Product>,
  ) {
    super(repository);
  }

  async getAll(
    options?: IGetAllOptions<Product>,
    relationsOptions?: Omit<IGetOneOptions<Product>, 'filter'>,
  ): Promise<ICollection<Product>> {
    const { filter, page, sort, fields } = options || {};
    const { relations } = relationsOptions || {};

    const [items, itemCount] = await this.repository.findAndCount({
      ...(relations && { relations }),
      where: filter,
      order: sort,
      select: fields,
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

  async getProductById(
    id: string,
    options?: IGetOneOptions<Product>,
  ): Promise<Product | null> {
    const { filter, relations } = options || {};
    return this.repository.findOne({
      where: {
        id,
        ...filter,
      },
      ...(relations && { relations }),
    });
  }
}
