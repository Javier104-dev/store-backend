import { ConsumerModule } from '@module/queue/consumer/consumer.module';
import { MessageModule } from '@module/queue/message/message.module';
import { ProducerModule } from '@module/queue/producer/producer.module';
import { Module } from '@nestjs/common';

@Module({
  imports: [ProducerModule, MessageModule, ConsumerModule],
  controllers: [],
  providers: [],
})
export class QueueModule {}
