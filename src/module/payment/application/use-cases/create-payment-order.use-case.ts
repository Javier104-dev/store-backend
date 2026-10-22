import { CartPricingService } from '@module/cart/application/service/cart-pricing.service';
import { CartService } from '@module/cart/application/service/cart.service';
import { CartHasNoItemsException } from '@module/cart/infrastructure/exception/cart-has-no-items.exception';
import { OrderService } from '@module/order/application/service/order.service';
import { OrderItem } from '@module/order/domain/order-item.interface';
import { CreatePaymentOrderResponse } from '@module/payment/infrastructure/dto/create-payment-order-response.interface';
import { MercadoPagoPaymentGatewayAdapter } from '@module/payment/infrastructure/mercadopago/mercadopago-payment-gateway.adapter';
import { Injectable } from '@nestjs/common';

@Injectable()
export class CreatePaymentOrderUseCase {
  constructor(
    private readonly cartService: CartService,
    private readonly cartPricingService: CartPricingService,
    private readonly orderService: OrderService,
    private readonly mercadoPagoPaymentGatewayAdapter: MercadoPagoPaymentGatewayAdapter,
  ) {}

  async execute(userId: string): Promise<CreatePaymentOrderResponse> {
    const cart = await this.cartService.getActiveCartByUserIdOrFail(userId);

    if (cart.items.length === 0) {
      throw new CartHasNoItemsException({
        message: 'Cart has no items',
      });
    }

    const totalAmount = this.cartPricingService.calculateSubtotal(cart.items);

    const items: OrderItem[] = cart.items.map((item) => ({
      title: item.product.name,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
    }));

    const order = await this.orderService.createFromCart(
      cart,
      items,
      totalAmount,
    );

    const { externalOrderId, checkoutUrl } =
      await this.mercadoPagoPaymentGatewayAdapter.createOrder(
        order.id,
        order.totalAmount,
        order.items,
      );

    await this.orderService.saveMpOrderId(order.id, externalOrderId);

    return { checkoutUrl };
  }
}
