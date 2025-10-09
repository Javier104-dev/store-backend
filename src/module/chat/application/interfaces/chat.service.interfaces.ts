export const OPENAI_CHAT_SERVICE_KEY = 'openai_chat_service';

export interface IChatService {
  sendMessage(
    message: string,
    databaseInfo: unknown,
    databaseType: string,
    language: string,
    threadId?: string,
  ): Promise<{
    response: string;
    isSqlQuery: boolean;
  }>;

  generateFormalResponse(
    query: string,
    result: unknown,
    language: string,
    threadId: string,
  ): Promise<string>;
}
