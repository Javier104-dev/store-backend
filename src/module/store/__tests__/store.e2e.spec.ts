import { CreateStoreDto } from '@module/store/application/dto/create-store.dto';
import { UpdateStoreDto } from '@module/store/application/dto/upate-store.dto';
import { Store } from '@module/store/domain/store.entity';
import { StoreNotFoundException } from '@module/store/infrastructure/exception/store-not-found.exception';
import { HttpStatus, INestApplication } from '@nestjs/common';
import request from 'supertest';

import { loadFixtures } from '@data/util/fixture-loader';

import EntityNotFoundException from '@common/base/infrastructure/database/exception/not-found.exception';

import { datasourceOptions } from '@config/orm.config';

import { createTestApp } from '@test/test.module.bootstrapper';
import { createAccessToken } from '@test/test.util';

describe('Store Module', () => {
  let app: INestApplication;

  const adminToken = createAccessToken({
    sub: '00000000-0000-0000-0000-00000000000X',
  });

  const adminToken2 = createAccessToken({
    sub: '00000000-0000-0000-0000-00000000000Z',
  });

  const adminToken3 = createAccessToken({
    sub: '00000000-0000-0000-0000-00000000000M',
  });

  const regularToken = createAccessToken({
    sub: '00000000-0000-0000-0000-00000000000Y',
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

  describe('GET - /store', () => {
    describe('Success cases', () => {
      it('should return paginated stores', async () => {
        await request(app.getHttpServer())
          .get('/api/v1/store')
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
                    type: Store.getEntityName(),
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

      it('should allow to filter by attributes', async () => {
        const name = 'store 2';
        await request(app.getHttpServer())
          .get(`/api/v1/store?filter[name]=${name}`)
          .auth(adminToken, { type: 'bearer' })
          .expect(HttpStatus.OK)
          .then(({ body }) => {
            const expectedResponse = expect.objectContaining({
              data: expect.arrayContaining([
                expect.objectContaining({
                  attributes: expect.objectContaining({
                    name,
                  }),
                }),
              ]),
            });
            expect(body).toEqual(expectedResponse);
          });
      });
    });

    describe('Error cases', () => {
      it('should throw an error if a regular user tries to access the endpoint', async () => {
        await request(app.getHttpServer())
          .get('/api/v1/store')
          .auth(regularToken, { type: 'bearer' })
          .expect(HttpStatus.INTERNAL_SERVER_ERROR);
      });
    });
  });

  describe('GET - /store', () => {
    describe('Success cases', () => {
      it('should return the store of the authenticated user', async () => {
        await request(app.getHttpServer())
          .get('/api/v1/store/owner')
          .auth(adminToken, { type: 'bearer' })
          .expect(HttpStatus.OK)
          .then(({ body }) => {
            expect(body).toEqual(
              expect.objectContaining({
                data: expect.objectContaining({
                  id: expect.any(String),
                  type: Store.getEntityName(),
                  attributes: expect.objectContaining({
                    name: expect.any(String),
                  }),
                }),
                links: expect.objectContaining({
                  self: expect.any(String),
                }),
              }),
            );
          });
      });
    });

    describe('Error cases', () => {
      it('should throw an error if the user does not have a store', async () => {
        const error = new StoreNotFoundException({
          message: `This user doesn't have a store yet`,
        });
        await request(app.getHttpServer())
          .get('/api/v1/store/owner')
          .auth(adminToken3, { type: 'bearer' })
          .expect(HttpStatus.NOT_FOUND)
          .then(({ body }) => {
            expect(body.error.detail).toEqual(error.message);
          });
      });

      it('should throw an error if a regular user tries to access the endpoint', async () => {
        await request(app.getHttpServer())
          .get('/api/v1/store/owner')
          .auth(regularToken, { type: 'bearer' })
          .expect(HttpStatus.INTERNAL_SERVER_ERROR);
      });
    });
  });

  describe('GET - /store/:id', () => {
    describe('Success cases', () => {
      it('should return a store by id', async () => {
        const storeId = '6f1a9c2e-8b7d-4f3a-9c21-3e7d2a6b4c8f';
        await request(app.getHttpServer())
          .get(`/api/v1/store/${storeId}`)
          .auth(adminToken, { type: 'bearer' })
          .expect(HttpStatus.OK)
          .then(({ body }) => {
            expect(body).toEqual(
              expect.objectContaining({
                data: expect.objectContaining({
                  type: Store.getEntityName(),
                  id: storeId,
                }),
              }),
            );
          });
      });
    });

    describe('Error cases', () => {
      it('should return an error if the store with the given ID does not exist', async () => {
        const storeId = '6f1a9c2e-8b7d-4f3a-9c21-3e7d2a6b4c8l';
        const error = new EntityNotFoundException(storeId);
        await request(app.getHttpServer())
          .get(`/api/v1/store/${storeId}`)
          .auth(adminToken, { type: 'bearer' })
          .expect(HttpStatus.NOT_FOUND)
          .then(({ body }) => {
            expect(body.error.detail).toEqual(error.message);
          });
      });

      it('should throw an error if a regular user tries to access the endpoint', async () => {
        const storeId = '6f1a9c2e-8b7d-4f3a-9c21-3e7d2a6b4c8l';
        await request(app.getHttpServer())
          .get(`/api/v1/store/${storeId}`)
          .auth(regularToken, { type: 'bearer' })
          .expect(HttpStatus.INTERNAL_SERVER_ERROR);
      });
    });
  });

  describe('POST - /store', () => {
    describe('Success cases', () => {
      it('should be able to create a store', async () => {
        const store: CreateStoreDto = {
          name: 'new store',
        };
        await request(app.getHttpServer())
          .post('/api/v1/store')
          .auth(adminToken2, { type: 'bearer' })
          .send(store)
          .expect(HttpStatus.CREATED)
          .then(({ body }) => {
            expect(body).toEqual(
              expect.objectContaining({
                data: expect.objectContaining({
                  type: Store.getEntityName(),
                  attributes: expect.objectContaining({
                    name: store.name,
                  }),
                }),
              }),
            );
          });
      });
    });

    describe('Error cases', () => {
      it('should throw an error if a regular user tries to access the endpoint', async () => {
        const store: CreateStoreDto = {
          name: 'new store',
        };
        await request(app.getHttpServer())
          .post('/api/v1/store')
          .auth(regularToken, { type: 'bearer' })
          .send(store)
          .expect(HttpStatus.INTERNAL_SERVER_ERROR);
      });
    });
  });

  describe('PATCH - /store', () => {
    describe('Success cases', () => {
      it('should be able to update a store', async () => {
        const storeId = '6f1a9c2e-8b7d-4f3a-9c21-3e7d2a6b4c8f';
        const updateStore: UpdateStoreDto = {
          name: 'updated name',
        };
        await request(app.getHttpServer())
          .patch('/api/v1/store')
          .auth(adminToken, { type: 'bearer' })
          .send(updateStore)
          .expect(HttpStatus.OK)
          .then(({ body }) => {
            expect(body).toEqual(
              expect.objectContaining({
                data: expect.objectContaining({
                  type: Store.getEntityName(),
                  id: storeId,
                  attributes: expect.objectContaining({
                    name: updateStore.name,
                  }),
                }),
              }),
            );
          });
      });
    });

    describe('Error cases', () => {
      it('should throw an error if the store to update does not exist', async () => {
        const updateStore: UpdateStoreDto = {
          name: 'updated name',
        };
        const error = new StoreNotFoundException({
          message: `This user doesn't have a store yet`,
        });
        await request(app.getHttpServer())
          .patch('/api/v1/store')
          .auth(adminToken3, { type: 'bearer' })
          .send(updateStore)
          .expect(HttpStatus.NOT_FOUND)
          .then(({ body }) => {
            expect(body.error.detail).toEqual(error.message);
          });
      });

      it('should throw an error if a regular user tries to access the endpoint', async () => {
        const updateStore: UpdateStoreDto = {
          name: 'updated name',
        };
        await request(app.getHttpServer())
          .patch('/api/v1/store')
          .auth(regularToken, { type: 'bearer' })
          .send(updateStore)
          .expect(HttpStatus.INTERNAL_SERVER_ERROR);
      });
    });
  });

  describe('DELETE - /store/:id', () => {
    describe('Success cases', () => {
      it('should delete a store by id', async () => {
        const storeId = '6f1a9c2e-8b7d-4f3a-9c21-3e7d2a6b4c8f';
        await request(app.getHttpServer())
          .delete(`/api/v1/store/${storeId}`)
          .auth(adminToken, { type: 'bearer' })
          .expect(HttpStatus.OK);
      });
    });

    describe('Error cases', () => {
      it('should return an error if the store to be deleted does not exist', async () => {
        const storeyId = '6f1a9c2e-8b7d-4f3a-9c21-3e7d2a6b4c8v';
        const error = new EntityNotFoundException(storeyId);
        await request(app.getHttpServer())
          .delete(`/api/v1/store/${storeyId}`)
          .auth(adminToken, { type: 'bearer' })
          .expect(HttpStatus.NOT_FOUND)
          .then(({ body }) => {
            expect(body.error.detail).toEqual(error.message);
          });
      });

      it('should throw an error if a regular user tries to access the endpoint', async () => {
        const storeyId = '6f1a9c2e-8b7d-4f3a-9c21-3e7d2a6b4c8v';
        await request(app.getHttpServer())
          .delete(`/api/v1/store/${storeyId}`)
          .auth(regularToken, { type: 'bearer' })
          .expect(HttpStatus.INTERNAL_SERVER_ERROR);
      });
    });
  });
});
