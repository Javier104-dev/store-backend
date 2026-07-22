import { CartItemMapper } from '@module/cart/application/mapper/cart-item.mapper';
import { CartMapper } from '@module/cart/application/mapper/cart.mapper';
import { CreateCartItemPolicyHandler } from '@module/cart/application/policy/cart-item/create-cart-item.policy-handler';
import { DeleteCartItemPolicyHandler } from '@module/cart/application/policy/cart-item/delete-cart-item.policy-handler';
import { UpdateCartItemPolicyHandler } from '@module/cart/application/policy/cart-item/update-cart-item.policy-handler';
import { ReadAllCartPolicyHandler } from '@module/cart/application/policy/cart/read-all-cart.policy-handler';
import { ReadCartPolicyHandler } from '@module/cart/application/policy/cart/read-cart.policy-handler';
import { CART_ITEM_REPOSITORY_KEY } from '@module/cart/application/repository/cart-item.repository.interface';
import { CART_REPOSITORY_KEY } from '@module/cart/application/repository/cart.repository.interface';
import { CartItemService } from '@module/cart/application/service/cart-item.service';
import { CartService } from '@module/cart/application/service/cart.service';
import { CartCrudUseCase } from '@module/cart/application/use-cases/cart-crud.use-case';
import { CreateCartItemUseCase } from '@module/cart/application/use-cases/create-cart-item.use-case';
import { DeleteCartItemUseCase } from '@module/cart/application/use-cases/delete-cart-item.use-case';
import { GetActiveCartUseCase } from '@module/cart/application/use-cases/get-active-cart.use.case';
import { UpdateCartItemtUseCase } from '@module/cart/application/use-cases/update-cart-item.use-case';
import { cartPermissions } from '@module/cart/domain/cart.permission';
import { CartItemPostgresRepository } from '@module/cart/infrastructure/database/cart-item.postgres.repository';
import { CartItemSchema } from '@module/cart/infrastructure/database/cart-item.schema';
import { CartPostgresRepository } from '@module/cart/infrastructure/database/cart.postgres.repository';
import { CartSchema } from '@module/cart/infrastructure/database/cart.schema';
import { CartController } from '@module/cart/interface/cart.controller';
import { AuthorizationModule } from '@module/iam/authorization/authorization.module';
import { UserModule } from '@module/iam/user/user.module';
import { ProductModule } from '@module/product/product.module';
import { UploadModule } from '@module/upload/upload.module';
import { Module, Provider } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

const policyHandlersProviders = [
  ReadCartPolicyHandler,
  ReadAllCartPolicyHandler,
  CreateCartItemPolicyHandler,
  UpdateCartItemPolicyHandler,
  DeleteCartItemPolicyHandler,
];

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
    AuthorizationModule.forFeature({
      permissions: cartPermissions,
    }),
    UserModule,
    ProductModule,
    UploadModule,
  ],
  controllers: [CartController],
  providers: [
    CartCrudUseCase,
    GetActiveCartUseCase,
    UpdateCartItemtUseCase,
    CreateCartItemUseCase,
    DeleteCartItemUseCase,
    cartRepositoryProvider,
    cartItemRepositoryProvider,
    CartMapper,
    CartItemMapper,
    CartService,
    CartItemService,
    ...policyHandlersProviders,
  ],
})
export class CartModule {}
