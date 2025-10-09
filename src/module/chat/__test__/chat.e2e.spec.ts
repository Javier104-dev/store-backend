import { HttpStatus, INestApplication } from '@nestjs/common';
import OpenAI from 'openai';
import request from 'supertest';

import { loadFixtures } from '@data/util/fixture-loader';

import { setupApp } from '@config/app.config';
import { datasourceOptions } from '@config/orm.config';

import { testModuleBootstrapper } from '@test/test.module.bootstrapper';
import { createAccessToken } from '@test/test.util';

import { OPENAI_CHAT_SERVICE_KEY } from '@/module/chat/application/interfaces/chat.service.interfaces';
import {
  ERROR_PROCESSING,
  OPENAI_ERROR,
  OPENAI_GENERATE_FORMAL_ERROR,
  OPENAI_QUOTA_EXCEEDED,
  OPENAI_TIMEOUT_ERROR,
} from '@/module/chat/application/messages/chat.error-messages';
import { ChatService } from '@/module/chat/application/service/chat.service';
import { DATABASE_SERVICE_KEY } from '@/module/db/application/interfaces/database.service.interfaces';
import { FORBIDDEN_SQL_OPERATION } from '@/module/db/application/messages/database.messages';
import { DatabaseService } from '@/module/db/application/service/database.service';
import { OPENAI_THREAD_SERVICE_KEY } from '@/module/thread/application/interfaces/thread.services.interfaces';
import { ThreadService } from '@/module/thread/application/service/thread.service';

const language = 'en';
const databaseInfo = 'This is the database information';
const threadId = 'thread_3WU7aMpjQCglf6xb3AGZmOts';

const run = {
  id: 'run_abc123',
  object: 'thread.run',
  created_at: 1699063290,
  assistant_id: 'asst_abc123',
  thread_id: 'thread_abc123',
  status: 'queued',
  started_at: 1699063290,
  completed_at: 1699063291,
  model: 'gpt-4o',
} as OpenAI.Beta.Threads.Runs.Run;

describe('db Module', () => {
  let app: INestApplication;
  let chatServiceMock: ChatService;
  let threadServiceMock: ThreadService;
  let databaseServiceMock: DatabaseService;

  const adminToken = createAccessToken({
    sub: '00000000-0000-0000-0000-00000000000X',
  });

  beforeAll(async () => {
    await loadFixtures(`${__dirname}/fixture`, datasourceOptions);
    const moduleRef = await testModuleBootstrapper();

    chatServiceMock = moduleRef.get<ChatService>(OPENAI_CHAT_SERVICE_KEY);
    threadServiceMock = moduleRef.get<ThreadService>(OPENAI_THREAD_SERVICE_KEY);
    databaseServiceMock = moduleRef.get<DatabaseService>(DATABASE_SERVICE_KEY);

    app = moduleRef.createNestApplication({ logger: false });
    setupApp(app);
    await app.init();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('POST LIST TABLES - /chat/send', () => {
    it('should return a list of tables in the database', async () => {
      const message =
        'I would like to know the existing tables in the database';

      jest.spyOn(threadServiceMock, 'addMessage').mockResolvedValueOnce({
        id: 'id',
      } as OpenAI.Beta.Threads.Messages.Message);
      jest.spyOn(threadServiceMock, 'createRunAndPoll').mockResolvedValueOnce({
        ...run,
        status: 'completed',
      });

      jest.spyOn(threadServiceMock, 'getMessages').mockResolvedValueOnce({
        data: [
          {
            content: [
              {
                text: {
                  value:
                    '{"response":"The existing tables in the database are: book, genre, user","isSqlQuery":false}',
                },
              },
            ],
          },
        ],
      } as OpenAI.Beta.Threads.Messages.MessagesPage);
      jest.spyOn(threadServiceMock, 'createRunAndPoll').mockResolvedValueOnce({
        ...run,
        status: 'completed',
      });
      jest.spyOn(threadServiceMock, 'getMessages').mockResolvedValueOnce({
        data: [
          {
            content: [
              {
                text: {
                  value:
                    'The existing tables in the database are: book, genre, user',
                },
              },
            ],
          },
        ],
      } as OpenAI.Beta.Threads.Messages.MessagesPage);

      await request(app.getHttpServer())
        .post('/api/v1/chat/send')
        .auth(adminToken, { type: 'bearer' })
        .send({ message, language, databaseInfo, threadId })
        .expect(HttpStatus.CREATED)
        .then(({ body }) => {
          expect(body).toHaveProperty('response');
          expect(body).toEqual({
            response:
              'The existing tables in the database are: book, genre, user',
          });
        });
    });
  });

  describe('POST COUNT USERS - /chat/send', () => {
    it('should return the correct count of users in the database', async () => {
      const message =
        'I would like to know the number of users in the database';

      jest.spyOn(chatServiceMock, 'sendMessage').mockResolvedValueOnce({
        response: 'SELECT COUNT(*) as count FROM users',
        isSqlQuery: true,
      });

      jest.spyOn(databaseServiceMock, 'executeQuery').mockResolvedValueOnce(23);

      jest.spyOn(threadServiceMock, 'createRunAndPoll').mockResolvedValueOnce({
        ...run,
        status: 'completed',
      });
      jest.spyOn(threadServiceMock, 'getMessages').mockResolvedValueOnce({
        data: [
          {
            content: [
              {
                text: {
                  value: 'The number of users in the database is: 23',
                },
              },
            ],
          },
        ],
      } as OpenAI.Beta.Threads.Messages.MessagesPage);

      await request(app.getHttpServer())
        .post('/api/v1/chat/send')
        .auth(adminToken, { type: 'bearer' })
        .send({ message, language, databaseInfo, threadId })
        .expect(HttpStatus.CREATED)
        .then(({ body }) => {
          expect(body).toHaveProperty('response');
          expect(body).toEqual({
            response: 'The number of users in the database is: 23',
          });
        });
    });
  });

  describe('POST - /chat/send - Data modification protection', () => {
    it('should reject requests that attempt to modify data', async () => {
      const message = 'I would like to delete the user with id 1';

      jest.spyOn(chatServiceMock, 'sendMessage').mockResolvedValueOnce({
        response: 'DELETE FROM users WHERE id = 1;',
        isSqlQuery: true,
      });

      await request(app.getHttpServer())
        .post('/api/v1/chat/send')
        .auth(adminToken, { type: 'bearer' })
        .send({ message, language, databaseInfo, threadId })
        .expect(HttpStatus.FORBIDDEN)
        .then(({ body }) => {
          expect(body).toEqual({
            error: {
              detail: `${FORBIDDEN_SQL_OPERATION}: DELETE`,
              source: { pointer: '/api/v1/chat/send' },
              status: '403',
              title: 'An error occurred',
            },
          });
        });
    });
  });

  describe('POST - /chat/send - Error handling', () => {
    it('Should throw an error when DB assistant query fails', async () => {
      jest.spyOn(threadServiceMock, 'addMessage').mockResolvedValueOnce({
        id: 'id',
      } as OpenAI.Beta.Threads.Messages.Message);
      jest.spyOn(threadServiceMock, 'createRunAndPoll').mockResolvedValueOnce({
        ...run,
        status: 'failed',
      });

      await request(app.getHttpServer())
        .post('/api/v1/chat/send')
        .auth(adminToken, { type: 'bearer' })
        .send({ message: 'test', language, databaseInfo, threadId })
        .expect(HttpStatus.INTERNAL_SERVER_ERROR)
        .then(({ body }) => {
          expect(body).toEqual({
            error: {
              detail: OPENAI_ERROR,
              source: { pointer: '/api/v1/chat/send' },
              status: '500',
              title: 'An error occurred',
            },
          });
        });
    });

    it('Should throw a timeout error if the DB assistant run does not complete in time', async () => {
      jest.spyOn(threadServiceMock, 'addMessage').mockResolvedValueOnce({
        id: 'id',
      } as OpenAI.Beta.Threads.Messages.Message);
      jest.spyOn(threadServiceMock, 'createRunAndPoll').mockResolvedValueOnce({
        ...run,
        status: 'expired',
      });

      await request(app.getHttpServer())
        .post('/api/v1/chat/send')
        .auth(adminToken, { type: 'bearer' })
        .send({ message: 'test', language, databaseInfo, threadId })
        .expect(HttpStatus.REQUEST_TIMEOUT)
        .then(({ body }) => {
          expect(body).toEqual({
            error: {
              detail: OPENAI_TIMEOUT_ERROR,
              source: { pointer: '/api/v1/chat/send' },
              status: '408',
              title: 'An error occurred',
            },
          });
        });
    });

    it('Should throw an error when DB formatter assistant query fails', async () => {
      jest.spyOn(chatServiceMock, 'sendMessage').mockResolvedValueOnce({
        response: 'SELECT COUNT(*) as count FROM users',
        isSqlQuery: true,
      });
      jest
        .spyOn(databaseServiceMock, 'executeQuery')
        .mockResolvedValueOnce('test');

      jest.spyOn(threadServiceMock, 'createRunAndPoll').mockResolvedValueOnce({
        ...run,
        status: 'failed',
      });

      await request(app.getHttpServer())
        .post('/api/v1/chat/send')
        .auth(adminToken, { type: 'bearer' })
        .send({ message: 'test', language, databaseInfo, threadId })
        .expect(HttpStatus.INTERNAL_SERVER_ERROR)
        .then(({ body }) => {
          expect(body).toEqual({
            error: {
              detail: OPENAI_ERROR,
              source: { pointer: '/api/v1/chat/send' },
              status: '500',
              title: 'An error occurred',
            },
          });
        });
    });

    it('Should throw an error when DB formatter assistant run does not complete in time', async () => {
      jest.spyOn(chatServiceMock, 'sendMessage').mockResolvedValueOnce({
        response: 'SELECT COUNT(*) as count FROM users',
        isSqlQuery: true,
      });
      jest
        .spyOn(databaseServiceMock, 'executeQuery')
        .mockResolvedValueOnce('test');

      jest.spyOn(threadServiceMock, 'createRunAndPoll').mockResolvedValueOnce({
        ...run,
        status: 'expired',
      });

      await request(app.getHttpServer())
        .post('/api/v1/chat/send')
        .auth(adminToken, { type: 'bearer' })
        .send({ message: 'test', language, databaseInfo, threadId })
        .expect(HttpStatus.REQUEST_TIMEOUT)
        .then(({ body }) => {
          expect(body).toEqual({
            error: {
              detail: OPENAI_TIMEOUT_ERROR,
              source: { pointer: '/api/v1/chat/send' },
              status: '408',
              title: 'An error occurred',
            },
          });
        });
    });

    it('Should throw an error when openai quota is exceeded', async () => {
      jest.spyOn(threadServiceMock, 'addMessage').mockRejectedValueOnce({
        response: {
          message: 'Quota exceeded',
          status: HttpStatus.TOO_MANY_REQUESTS,
        },
      });

      await request(app.getHttpServer())
        .post('/api/v1/chat/send')
        .auth(adminToken, { type: 'bearer' })
        .send({ message: 'test', language, databaseInfo, threadId })
        .expect(HttpStatus.TOO_MANY_REQUESTS)
        .then(({ body }) => {
          expect(body).toEqual({
            error: {
              detail: OPENAI_QUOTA_EXCEEDED,
              source: { pointer: '/api/v1/chat/send' },
              status: '429',
              title: 'An error occurred',
            },
          });
        });
    });

    it('Should throw a default error when DB assistant query fails with an unknown error', async () => {
      jest.spyOn(threadServiceMock, 'addMessage').mockRejectedValueOnce({
        response: {
          message: 'Unknown error',
          status: HttpStatus.INTERNAL_SERVER_ERROR,
        },
      });

      await request(app.getHttpServer())
        .post('/api/v1/chat/send')
        .auth(adminToken, { type: 'bearer' })
        .send({ message: 'test', language, databaseInfo, threadId })
        .expect(HttpStatus.INTERNAL_SERVER_ERROR)
        .then(({ body }) => {
          expect(body).toEqual({
            error: {
              detail: OPENAI_ERROR,
              source: { pointer: '/api/v1/chat/send' },
              status: '500',
              title: 'An error occurred',
            },
          });
        });
    });

    it('Should throw a default error when DB formatter assistant query fails with an unknown error', async () => {
      jest.spyOn(chatServiceMock, 'sendMessage').mockResolvedValueOnce({
        response: 'SELECT COUNT(*) as count FROM users',
        isSqlQuery: true,
      });
      jest
        .spyOn(databaseServiceMock, 'executeQuery')
        .mockResolvedValueOnce('test');
      jest.spyOn(threadServiceMock, 'createThread').mockRejectedValueOnce({
        response: {
          message: 'Unknown error',
          status: HttpStatus.INTERNAL_SERVER_ERROR,
        },
      });

      await request(app.getHttpServer())
        .post('/api/v1/chat/send')
        .auth(adminToken, { type: 'bearer' })
        .send({ message: 'test', language, databaseInfo, threadId })
        .expect(HttpStatus.INTERNAL_SERVER_ERROR)
        .then(({ body }) => {
          expect(body).toEqual({
            error: {
              detail: OPENAI_GENERATE_FORMAL_ERROR,
              source: { pointer: '/api/v1/chat/send' },
              status: '500',
              title: 'An error occurred',
            },
          });
        });
    });

    it('Should throw a default error when controller receives a non HttpException error from service', async () => {
      jest
        .spyOn(chatServiceMock, 'sendMessage')
        .mockRejectedValueOnce(new Error('Unknown error'));

      await request(app.getHttpServer())
        .post('/api/v1/chat/send')
        .auth(adminToken, { type: 'bearer' })
        .send({ message: 'test', language, databaseInfo, threadId })
        .expect(HttpStatus.INTERNAL_SERVER_ERROR)
        .then(({ body }) => {
          expect(body).toEqual({
            error: {
              detail: ERROR_PROCESSING,
              source: { pointer: '/api/v1/chat/send' },
              status: '500',
              title: 'An error occurred',
            },
          });
        });
    });
  });
});
