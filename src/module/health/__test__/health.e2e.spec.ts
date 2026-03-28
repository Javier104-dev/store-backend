import { HttpStatus, INestApplication } from '@nestjs/common';
import request from 'supertest';

import { createTestApp } from '@test/test.module.bootstrapper';

describe('User Module', () => {
  let app: INestApplication;

  beforeAll(async () => {
    app = await createTestApp();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('GET - /health', () => {
    it('should return a success response', async () => {
      await request(app.getHttpServer())
        .get('/api/v1/health')
        .expect(HttpStatus.OK);
    });
  });
});
