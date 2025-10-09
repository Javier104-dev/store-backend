import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import * as dotenv from 'dotenv';

import { IChatService } from '@/module/chat/application/interfaces/chat.service.interfaces';
import {
  OPENAI_ERROR,
  OPENAI_GENERATE_FORMAL_ERROR,
  OPENAI_QUOTA_EXCEEDED,
  OPENAI_TIMEOUT_ERROR,
} from '@/module/chat/application/messages/chat.error-messages';
import { OPENAI_THREAD_SERVICE_KEY } from '@/module/thread/application/interfaces/thread.services.interfaces';
import { ThreadService } from '@/module/thread/application/service/thread.service';

dotenv.config();

@Injectable()
export class ChatService implements IChatService {
  private dbAssistantId = process.env.OPENAI_DB_ASSISTANT_ID;
  private dbFormatterAssistantId = process.env.OPENAI_DB_FORMATTER_ASSISTANT_ID;
  constructor(
    @Inject(OPENAI_THREAD_SERVICE_KEY)
    private readonly threadService: ThreadService,
  ) {}

  async sendMessage(
    message: string,
    databaseDetails: unknown,
    databaseType: string,
    language: string,
    threadId: string,
  ): Promise<{
    response: string;
    isSqlQuery: boolean;
  }> {
    try {
      await this.threadService.addMessage(
        threadId,
        `user request: ${message}`,
        'user',
      );
      const run = await this.threadService.createRunAndPoll(
        threadId,
        this.dbAssistantId,
        `
       These are the variables that you should use to answer the user's question:
      - \`databaseType\`: ${databaseType}
      - \`databaseDetails\`: ${JSON.stringify(databaseDetails)}
      - \`language\`: ${language}
      `,
      );
      return JSON.parse(await this.handleRunStatus(run.status, threadId));
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      if (error.response && error.response.status === 429) {
        throw new HttpException(
          OPENAI_QUOTA_EXCEEDED,
          HttpStatus.TOO_MANY_REQUESTS,
        );
      } else {
        throw new HttpException(OPENAI_ERROR, HttpStatus.INTERNAL_SERVER_ERROR);
      }
    }
  }

  async generateFormalResponse(
    query: string,
    result: unknown,
    language: string,
    threadId: string,
  ): Promise<string> {
    try {
      const formattedResult = JSON.stringify(result);
      const run = await this.threadService.createRunAndPoll(
        threadId,
        this.dbFormatterAssistantId,
        `The language variable is: ${language}.
        Given the query: "${query}" and the SQL result: "${formattedResult}", please generate a formal and correct response. The SQL result may come in various formats, such as an array of objects or simple values.`,
      );
      return await this.handleRunStatus(run.status, threadId);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        OPENAI_GENERATE_FORMAL_ERROR,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  private handleRunStatus(status: string, threadId: string): Promise<string> {
    switch (status) {
      case 'completed':
        return this.getCompletedResponse(threadId);
      case 'failed':
        throw new HttpException(OPENAI_ERROR, HttpStatus.INTERNAL_SERVER_ERROR);
      case 'expired':
        throw new HttpException(
          OPENAI_TIMEOUT_ERROR,
          HttpStatus.REQUEST_TIMEOUT,
        );
    }
  }

  private async getCompletedResponse(threadId: string): Promise<string> {
    const messageList = await this.threadService.getMessages(threadId, 1);
    const content = messageList.data[0].content[0] as {
      text: { value: string };
    };

    return content.text.value;
  }
}
