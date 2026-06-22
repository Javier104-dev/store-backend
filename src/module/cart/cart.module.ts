import { CartItemMapper } from '@module/cart/application/mapper/cart-item.mapper';
import { CartMapper } from '@module/cart/application/mapper/cart.mapper';
import { CART_ITEM_REPOSITORY_KEY } from '@module/cart/application/repository/cart-item.repository.interface';
import { CART_REPOSITORY_KEY } from '@module/cart/application/repository/cart.repository.interface';
import { CartItemService } from '@module/cart/application/service/cart-item.service';
import { CartService } from '@module/cart/application/service/cart.service';
import { CartCrudUseCase } from '@module/cart/application/use-cases/cart-crud.use-case';
import { CreateCartItemUseCase } from '@module/cart/application/use-cases/create-cart-item.use-case';
import { DeleteCarttUseCase } from '@module/cart/application/use-cases/delete-cart.use-case';
import { GetActiveCartUseCase } from '@module/cart/application/use-cases/get-active-cart.use.case';
import { UpdateCartItemtUseCase } from '@module/cart/application/use-cases/update-cart-item.use-case';
import { CartItemPostgresRepository } from '@module/cart/infrastructure/database/cart-item.postgres.repository';
import { CartItemSchema } from '@module/cart/infrastructure/database/cart-item.schema';
import { CartPostgresRepository } from '@module/cart/infrastructure/database/cart.postgres.repository';
import { CartSchema } from '@module/cart/infrastructure/database/cart.schema';
import { CartController } from '@module/cart/interface/cart.controller';
import { UserModule } from '@module/iam/user/user.module';
import { ProductModule } from '@module/product/product.module';
import { Module, Provider } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

const cartRepositoryProvider: Provider = {
  provide: CART_REPOSITORY_KEY,
  useClass: CartPostgresRepository,
};

const cartItemRepositoryProvider: Provider = {
  provide: CART_ITEM_REPOSITORY_KEY,
  useClass: CartItemPostgresRepository,
};

@Module({
  imports: [
    TypeOrmModule.forFeature([CartSchema, CartItemSchema]),
    UserModule,
    ProductModule,
  ],
  controllers: [CartController],
  providers: [
    CartCrudUseCase,
    GetActiveCartUseCase,
    UpdateCartItemtUseCase,
    CreateCartItemUseCase,
    DeleteCarttUseCase,
    cartRepositoryProvider,
    cartItemRepositoryProvider,
    CartMapper,
    CartItemMapper,
    CartService,
    CartItemService,
  ],
})
export class CartModule {}
