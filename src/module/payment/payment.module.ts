import { CartModule } from '@module/cart/cart.module';
import { AuthorizationModule } from '@module/iam/authorization/authorization.module';
import { OrderModule } from '@module/order/order.module';
import { CreatePaymentOrderPolicyHandler } from '@module/payment/application/policy/create-payment-order.policy-handler';
import { CreatePaymentOrderUseCase } from '@module/payment/application/use-cases/create-payment-order.use-case';
import { ProcessPaymentWebhookUseCase } from '@module/payment/application/use-cases/process-payment-webhook.use-case';
import { paymentPermissions } from '@module/payment/domain/payment.permission';
import { MercadoPagoPaymentGatewayAdapter } from '@module/payment/infrastructure/mercadopago/mercadopago-payment-gateway.adapter';
import { PaymentController } from '@module/payment/interface/payment.controller';
import { Module } from '@nestjs/common';

const policyHandlersProviders = [CreatePaymentOrderPolicyHandler];

@Module({
  imports: [
    CartModule,
    OrderModule,
    AuthorizationModule.forFeature({
      permissions: paymentPermissions,
    }),
  ],
  controllers: [PaymentController],
  providers: [
    CreatePaymentOrderUseCase,
    ProcessPaymentWebhookUseCase,
    MercadoPagoPaymentGatewayAdapter,
    ...policyHandlersProviders,
  ],
})
export class PaymentModule {}
