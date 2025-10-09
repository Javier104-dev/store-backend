import { Message } from '@aws-sdk/client-sqs';
import { MessageService } from '@module/queue/message/application/service/message.service';
import {
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
  forwardRef,
} from '@nestjs/common';
import { SqsService } from '@ssut/nestjs-sqs';

@Injectable()
export class ConsumerService {
  private logger = new Logger();

  constructor(
    private readonly messageService: MessageService,
    @Inject(forwardRef(() => SqsService))
    private readonly sqsService: SqsService,
  ) {}

  onModuleInit() {
    const consumers = Array.from(this.sqsService.consumers.entries());
    consumers.forEach(([, consumer]) => {
      consumer.instance.on('error', (error) => {
        this.logger.error(error);
      });
    });
  }

  async processMessage(
    message: Message & { error?: string },
    queueName: string,
  ) {
    try {
      const messageEntity =
        await this.messageService.saveOneMessageFromQueueMessage(
          message,
          queueName,
        );
      return messageEntity;
    } catch (error) {
      throw new InternalServerErrorException(
        `Error processing message: ${error}`,
      );
    }
  }
}
