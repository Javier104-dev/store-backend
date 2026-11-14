import { OrderMapper } from '@module/order/application/mapper/order.mapper';
import { ORDER_REPOSITORY_KEY } from '@module/order/application/repository/order.repository.interface';
import { OrderService } from '@module/order/application/service/order.service';
import { OrderPostgresRepository } from '@module/order/infrastructure/database/order.postgres.repository';
import { OrderSchema } from '@module/order/infrastructure/database/order.schema';
import { Module, Provider } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

const orderRepositoryProvider: Provider = {
  provide: ORDER_REPOSITORY_KEY,
  useClass: OrderPostgresRepository,
};

@Module({
  imports: [TypeOrmModule.forFeature([OrderSchema])],
  providers: [orderRepositoryProvider, OrderService, OrderMapper],
  exports: [OrderService],
})
export class OrderModule {}
