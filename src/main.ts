import { AppModule } from '@module/app.module';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import {
  StorageDriver,
  initializeTransactionalContext,
} from 'typeorm-transactional';

import { setupApp, setupSwagger } from '@config/app.config';

import { DatabaseModule } from '@/module/db/database.module';

async function bootstrap() {
  initializeTransactionalContext({ storageDriver: StorageDriver.AUTO });
  const app = await NestFactory.create(AppModule);
  await DatabaseModule.initialize();
  const configService = app.get(ConfigService);
  app.enableCors(configService.get('frontend.url'));
  setupApp(app);
  setupSwagger(app);
  const port = configService.get('server.port');
  await app.listen(port);
  console.log(`Server is running on port ${port}`);
}

bootstrap();
