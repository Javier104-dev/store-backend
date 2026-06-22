import { CartService } from '@module/cart/application/service/cart.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class DeleteCarttUseCase {
  constructor(private readonly cartService: CartService) {}

  async execute(userId: string): Promise<void> {
    return this.cartService.deleteCart(userId);
  }
}
