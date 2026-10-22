import { CartModule } from '@module/cart/cart.module';
import { OrderModule } from '@module/order/order.module';
import { CreatePaymentOrderUseCase } from '@module/payment/application/use-cases/create-payment-order.use-case';
import { ProcessPaymentWebhookUseCase } from '@module/payment/application/use-cases/process-payment-webhook.use-case';
import { MercadoPagoPaymentGatewayAdapter } from '@module/payment/infrastructure/mercadopago/mercadopago-payment-gateway.adapter';
import { PaymentController } from '@module/payment/interface/payment.controller';
import { Module } from '@nestjs/common';

@Module({
  imports: [CartModule, OrderModule],
  controllers: [PaymentController],
  providers: [
    CreatePaymentOrderUseCase,
    ProcessPaymentWebhookUseCase,
    MercadoPagoPaymentGatewayAdapter,
  ],
})
export class PaymentModule {}
