import { OrderItem } from '@module/order/domain/order-item.interface';
import { CreateOrderResult } from '@module/payment/infrastructure/dto/create-order-result.interface';
import { OrderStatusResult } from '@module/payment/infrastructure/dto/order-status-result.interface';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import MercadoPagoConfig, { Order } from 'mercadopago';
import { randomUUID } from 'node:crypto';

@Injectable()
export class MercadoPagoPaymentGatewayAdapter {
  private readonly client: Order;

  constructor(private readonly configService: ConfigService) {
    const config = new MercadoPagoConfig({
      accessToken: this.configService.get('mp.accessToken'),
    });
    this.client = new Order(config);
  }

  async createOrder(
    externalReference: string,
    totalAmount: string,
    items: OrderItem[],
  ): Promise<CreateOrderResult> {
    const order = await this.client.create({
      body: {
        type: 'online',
        processing_mode: 'manual',
        total_amount: totalAmount,
        external_reference: externalReference,
        items: items.map((item) => ({
          title: item.title,
          quantity: item.quantity,
          unit_price: item.unitPrice,
        })),
      },
      requestOptions: {
        idempotencyKey: randomUUID(),
      },
    });

    return {
      externalOrderId: order.id,
      checkoutUrl: order.checkout_url,
    };
  }

  async getOrderStatus(orderId: string): Promise<OrderStatusResult> {
    const order = await this.client.get({ id: orderId });

    return {
      status: order.status,
      totalPaidAmount: order.total_paid_amount ?? '0',
      externalReference: order.external_reference,
    };
  }
}
