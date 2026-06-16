import { CART_REPOSITORY_KEY } from '@module/cart/application/repository/cart.repository.interface';
import { CartCrudUseCase } from '@module/cart/application/use-cases/cart-crud.use-case';
import { CartItemSchema } from '@module/cart/infrastructure/database/cart-item.schema';
import { CartPostgresRepository } from '@module/cart/infrastructure/database/cart.postgres.repository';
import { CartSchema } from '@module/cart/infrastructure/database/cart.schema';
import { CartController } from '@module/cart/interface/cart.controller';
import { Module, Provider } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

const cartRepositoryProvider: Provider = {
  provide: CART_REPOSITORY_KEY,
  useClass: CartPostgresRepository,
};

@Module({
  imports: [TypeOrmModule.forFeature([CartSchema, CartItemSchema])],
  controllers: [CartController],
  providers: [CartCrudUseCase, cartRepositoryProvider],
})
export class CartModule {}
