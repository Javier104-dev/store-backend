import { HttpStatus, INestApplication } from '@nestjs/common';
import request from 'supertest';

import { loadFixtures } from '@data/util/fixture-loader';

import { setupApp } from '@config/app.config';
import { datasourceOptions } from '@config/orm.config';

import { testModuleBootstrapper } from '@test/test.module.bootstrapper';
import { createAccessToken } from '@test/test.util';

import { GENRE_ENTITY_NAME } from '@/module/genre/domain/genre.name';

describe('Genre Module', () => {
  let app: INestApplication;

  const adminToken = createAccessToken({
    sub: '00000000-0000-0000-0000-00000000000X',
  });

  beforeAll(async () => {
    await loadFixtures(`${__dirname}/fixture`, datasourceOptions);
    const moduleRef = await testModuleBootstrapper();
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

  describe('GET /genre', () => {
    it('should return paginated genres', async () => {
      await request(app.getHttpServer())
        .get('/api/v1/genre')
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
                  type: GENRE_ENTITY_NAME,
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
