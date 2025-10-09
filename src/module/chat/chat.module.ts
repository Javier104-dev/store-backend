import { OPENAI_CHAT_SERVICE_KEY } from '@module/chat/application/interfaces/chat.service.interfaces';
import { ChatService } from '@module/chat/application/service/chat.service';
import { ChatController } from '@module/chat/interface/chat.controller';
import { DATABASE_SERVICE_KEY } from '@module/db/application/interfaces/database.service.interfaces';
import { DatabaseService } from '@module/db/application/service/database.service';
import { DatabaseController } from '@module/db/interface/database.controller';
import { Module } from '@nestjs/common';

import { ThreadModule } from '@/module/thread/thread.module';

@Module({
  imports: [ThreadModule],
  controllers: [ChatController],
  providers: [
    {
      provide: OPENAI_CHAT_SERVICE_KEY,
      useClass: ChatService,
    },
    {
      provide: DATABASE_SERVICE_KEY,
      useClass: DatabaseService,
    },
    DatabaseController,
  ],
  exports: [
    {
      provide: OPENAI_CHAT_SERVICE_KEY,
      useClass: ChatService,
    },
  ],
})
export class ChatModule {}
