import { Product } from '@module/product/domain/product.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import BaseRepository from '@common/base/infrastructure/database/base.repository';

import { ProductSchema } from './product.schema';
import { Repository } from 'typeorm';

@Injectable()
export class ProductPostgresRepository extends BaseRepository<Product> {
  constructor(
    @InjectRepository(ProductSchema)
    protected readonly repository: Repository<Product>,
  ) {
    super(repository);
  }
}
