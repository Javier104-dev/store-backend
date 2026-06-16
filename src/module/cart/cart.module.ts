import { CartItemSchema } from '@module/cart/infrastructure/database/cart-item.schema';
import { CartSchema } from '@module/cart/infrastructure/database/cart.schema';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([CartSchema, CartItemSchema])],
})
export class CartModule {}
