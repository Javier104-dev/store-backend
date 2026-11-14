import { CartService } from '@module/cart/application/service/cart.service';
import { CART_STATUS } from '@module/cart/domain/cart-status';
import { OrderService } from '@module/order/application/service/order.service';
import { ORDER_STATUS } from '@module/order/domain/order-status';
import { MercadoPagoWebhook } from '@module/payment/infrastructure/dto/mercado-pago-webhook.interface';
import { MercadoPagoPaymentGatewayAdapter } from '@module/payment/infrastructure/mercadopago/mercadopago-payment-gateway.adapter';
import { Injectable } from '@nestjs/common';
import Decimal from 'decimal.js';

@Injectable()
export class ProcessPaymentWebhookUseCase {
  constructor(
    private readonly mercadoPagoPaymentGatewayAdapter: MercadoPagoPaymentGatewayAdapter,
    private readonly cartService: CartService,
    private readonly orderService: OrderService,
  ) {}

  async execute(body: MercadoPagoWebhook): Promise<void> {
    const orderId = body?.data?.id;

    if (body?.type !== 'order' || !orderId) {
      return;
    }

    const mpOrder =
      await this.mercadoPagoPaymentGatewayAdapter.getOrderStatus(orderId);
    const order = await this.orderService.getOrderById(
      mpOrder.externalReference,
    );

    if (order.status === ORDER_STATUS.PAID) return;

    if (mpOrder.status === 'processed') {
      const paidTotal = new Decimal(mpOrder.totalPaidAmount);
      const expectedTotal = new Decimal(order.totalAmount);

      if (!new Decimal(paidTotal).equals(new Decimal(expectedTotal))) return;

      await this.orderService.updateStatus(order.id, ORDER_STATUS.PAID);
      await this.cartService.updateStatus(order.cart.id, CART_STATUS.COMPLETED);
    } else if (['failed', 'expired', 'canceled'].includes(mpOrder.status)) {
      await this.orderService.updateStatus(order.id, ORDER_STATUS.FAILED);
    }
  }
}
