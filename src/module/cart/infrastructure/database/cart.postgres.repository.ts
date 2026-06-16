import { Cart } from '@module/cart/domain/cart.entity';
import { CartSchema } from '@module/cart/infrastructure/database/cart.schema';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import BaseRepository from '@common/base/infrastructure/database/base.repository';

@Injectable()
export class CartPostgresRepository extends BaseRepository<Cart> {
  constructor(
    @InjectRepository(CartSchema)
    protected readonly repository: Repository<Cart>,
  ) {
    super(repository);
  }
}
