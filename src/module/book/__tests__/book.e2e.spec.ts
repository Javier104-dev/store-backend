import { HttpStatus, INestApplication } from '@nestjs/common';
import request from 'supertest';

import { loadFixtures } from '@data/util/fixture-loader';

import { datasourceOptions } from '@config/orm.config';

import { createTestApp } from '@test/test.module.bootstrapper';
import { createAccessToken } from '@test/test.util';

import { BOOK_ENTITY_NAME } from '@/module/book/domain/book.name';

describe('Book Module', () => {
  let app: INestApplication;

  const adminToken = createAccessToken({
    sub: '00000000-0000-0000-0000-00000000000X',
  });

  beforeAll(async () => {
    await loadFixtures(`${__dirname}/fixture`, datasourceOptions);
    app = await createTestApp();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('GET /book', () => {
    it('should return paginated books', async () => {
      await request(app.getHttpServer())
        .get('/api/v1/book')
        .auth(adminToken, { type: 'bearer' })
        .expect(HttpStatus.OK)
        .then(({ body }) => {
          expect(body).toEqual(
            expect.objectContaining({
              data: expect.arrayContaining([
                expect.objectContaining({
                  attributes: expect.objectContaining({
                    name: expect.any(String),
                  }),
                  type: BOOK_ENTITY_NAME,
                }),
              ]),
              meta: expect.objectContaining({
                itemCount: expect.any(Number),
                pageCount: expect.any(Number),
                pageNumber: expect.any(Number),
                pageSize: expect.any(Number),
              }),
            }),
          );
        });
    });
  });
});
