import { Message as SQSMessage } from '@aws-sdk/client-sqs';
import { ICreateMessageDto } from '@module/queue/message/application/dto/create-message.dto.interface';
import { MessageResponseDto } from '@module/queue/message/application/dto/message-response.dto';
import { MessageMapper } from '@module/queue/message/application/mapper/message.mapper';
import {
  IMessageRepository,
  MESSAGE_REPOSITORY_KEY,
} from '@module/queue/message/application/repository/message.repository.interface';
import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class MessageService {
  constructor(
    @Inject(MESSAGE_REPOSITORY_KEY)
    private readonly messageRepository: IMessageRepository,
    private readonly messageMapper: MessageMapper,
  ) {}

  async saveOneMessageFromQueueMessage(
    queueMessage: SQSMessage,
    queueName: string,
  ) {
    const messageDto = this.messageMapper.fromQueueMessageToMessageDto(
      queueMessage,
      queueName,
    );

    return this.saveOne(messageDto);
  }

  async saveOne(
    createMessageDto: ICreateMessageDto,
  ): Promise<MessageResponseDto> {
    const message = await this.messageRepository.saveOne(
      this.messageMapper.fromCreateMessageDtoToMessage(createMessageDto),
    );
    return this.messageMapper.fromMessageToMessageResponseDto(message);
  }
}
