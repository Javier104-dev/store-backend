import { AuthType } from '@module/iam/authentication/domain/auth-type.enum';
import { Auth } from '@module/iam/authentication/infrastructure/decorator/auth.decorator';
import { CurrentUser } from '@module/iam/authentication/infrastructure/decorator/current-user.decorator';
import { User } from '@module/iam/user/domain/user.entity';
import { CreatePaymentOrderUseCase } from '@module/payment/application/use-cases/create-payment-order.use-case';
import { ProcessPaymentWebhookUseCase } from '@module/payment/application/use-cases/process-payment-webhook.use-case';
import { CreatePaymentOrderResponse } from '@module/payment/infrastructure/dto/create-payment-order-response.interface';
import { MercadoPagoWebhook } from '@module/payment/infrastructure/dto/mercado-pago-webhook.interface';
import { Body, Controller, Post } from '@nestjs/common';

@Controller('payment')
export class PaymentController {
  constructor(
    private readonly createPaymentOrderUseCase: CreatePaymentOrderUseCase,
    private readonly processPaymentWebhookUseCase: ProcessPaymentWebhookUseCase,
  ) {}

  @Post('checkout')
  async createPaymentOrder(
    @CurrentUser() user: User,
  ): Promise<CreatePaymentOrderResponse> {
    return this.createPaymentOrderUseCase.execute(user.id);
  }

  @Post('webhook')
  @Auth(AuthType.None)
  async processPaymentWebhook(@Body() body: MercadoPagoWebhook): Promise<void> {
    return this.processPaymentWebhookUseCase.execute(body);
  }
}
