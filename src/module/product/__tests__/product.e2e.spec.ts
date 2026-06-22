import { Product } from '@module/product/domain/product.entity';
import { ProductNotFoundException } from '@module/product/infrastructure/exception/product-not-found.exception';
import { HttpStatus, INestApplication } from '@nestjs/common';
import request from 'supertest';

import { loadFixtures } from '@data/util/fixture-loader';

import EntityNotFoundException from '@common/base/infrastructure/database/exception/not-found.exception';

import { datasourceOptions } from '@config/orm.config';

import { createTestApp } from '@test/test.module.bootstrapper';
import { createAccessToken } from '@test/test.util';

describe('Product Module', () => {
  let app: INestApplication;

  const adminToken = createAccessToken({
    sub: '00000000-0000-0000-0000-00000000000X',
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

  describe('GET - /product', () => {
    describe('Success cases', () => {
      it('should return paginated products', async () => {
        await request(app.getHttpServer())
          .get('/api/v1/product')
          .expect(HttpStatus.OK)
          .then(({ body }) => {
            expect(body).toEqual(
              expect.objectContaining({
                data: expect.arrayContaining([
                  expect.objectContaining({
                    attributes: expect.objectContaining({
                      name: expect.any(String),
                    }),
                    type: Product.getEntityName(),
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

      it('should filter products by store id', async () => {
        const storeId = '6f1a9c2e-8b7d-4f3a-9c21-3e7d2a6b4c8f';
        await request(app.getHttpServer())
          .get(`/api/v1/product?filter[store][id]=${storeId}`)
          .expect(HttpStatus.OK)
          .then(({ body }) => {
            expect(body).toEqual(
              expect.objectContaining({
                data: expect.arrayContaining([
                  expect.objectContaining({
                    type: Product.getEntityName(),
                  }),
                ]),
              }),
            );
            expect(body.data).toHaveLength(2);
          });
      });

      it('should filter products by category id', async () => {
        const categoryId = 'a7d1e5c9-2b84-4c6f-b0e3-91f2d8a7c6b4';
        const productId = '8f3c2a91-4b7d-4e6f-8c21-9a5d3b7e2f10';
        await request(app.getHttpServer())
          .get(`/api/v1/product?filter[categories][id]=${categoryId}`)
          .expect(HttpStatus.OK)
          .then(({ body }) => {
            expect(body).toEqual(
              expect.objectContaining({
                data: expect.arrayContaining([
                  expect.objectContaining({
                    id: productId,
                  }),
                ]),
              }),
            );
            expect(body.data).toHaveLength(1);
          });
      });
    });
  });

  describe('GET - /product/owner', () => {
    describe('Success cases', () => {
      it('should return paginated products for the authenticated store owner', async () => {
        await request(app.getHttpServer())
          .get('/api/v1/product/owner')
          .auth(adminToken, { type: 'bearer' })
          .expect(HttpStatus.OK)
          .then(({ body }) => {
            expect(body).toEqual(
              expect.objectContaining({
                data: expect.arrayContaining([
                  expect.objectContaining({
                    type: Product.getEntityName(),
                  }),
                ]),
              }),
            );
            expect(body.data).toHaveLength(2);
          });
      });
    });
  });

  describe('GET - /product/owner/:id', () => {
    describe('Success cases', () => {
      it('should return a product by id belonging to the authenticated owner', async () => {
        const productId = 'c1a7e4d2-9f6b-4a33-8b52-7d1c9e4f2a88';
        const RELATIONS = 'categories';
        await request(app.getHttpServer())
          .get(`/api/v1/product/owner/${productId}`)
          .auth(adminToken, { type: 'bearer' })
          .expect(HttpStatus.OK)
          .then(({ body }) => {
            expect(body).toEqual(
              expect.objectContaining({
                data: expect.objectContaining({
                  type: Product.getEntityName(),
                  id: productId,
                  relationships: expect.objectContaining({
                    categories: expect.objectContaining({
                      data: expect.arrayContaining([
                        expect.objectContaining({
                          type: RELATIONS,
                        }),
                      ]),
                    }),
                  }),
                }),
                included: expect.arrayContaining([
                  expect.objectContaining({
                    type: RELATIONS,
                  }),
                ]),
              }),
            );
          });
      });
    });

    describe('Error cases', () => {
      it('should return an error if the product with the given ID does not belong to the authenticated owner', async () => {
        const productId = '8f3c2a91-4b7d-4e6f-8c21-9a5d3b7e2f00';
        const error = new ProductNotFoundException({
          message: `Product with id ${productId} not found`,
        });
        await request(app.getHttpServer())
          .get(`/api/v1/product/owner/${productId}`)
          .auth(adminToken, { type: 'bearer' })
          .expect(HttpStatus.NOT_FOUND)
          .then(({ body }) => {
            expect(body.error.detail).toEqual(error.message);
          });
      });

      it('should throw an error if a regular user tries to access the endpoint', async () => {
        const productId = '3d9b6f21-7a4e-4c8d-9f13-2b6e1a7c5d11';
        await request(app.getHttpServer())
          .get(`/api/v1/product/owner/${productId}`)
          .auth(regularToken, { type: 'bearer' })
          .expect(HttpStatus.INTERNAL_SERVER_ERROR);
      });
    });
  });

  describe('GET - /product/:id', () => {
    describe('Success cases', () => {
      it('should return a product by id', async () => {
        const productId = '8f3c2a91-4b7d-4e6f-8c21-9a5d3b7e2f10';
        const RELATIONS = 'categories';
        await request(app.getHttpServer())
          .get(`/api/v1/product/${productId}`)
          .expect(HttpStatus.OK)
          .then(({ body }) => {
            expect(body).toEqual(
              expect.objectContaining({
                data: expect.objectContaining({
                  type: Product.getEntityName(),
                  id: productId,
                  relationships: expect.objectContaining({
                    categories: expect.objectContaining({
                      data: expect.arrayContaining([
                        expect.objectContaining({
                          type: RELATIONS,
                        }),
                      ]),
                    }),
                  }),
                }),
                included: expect.arrayContaining([
                  expect.objectContaining({
                    type: RELATIONS,
                  }),
                ]),
              }),
            );
            expect(body.included).toHaveLength(2);
          });
      });
    });

    describe('Error cases', () => {
      it('should return an error if the product with the given ID does not exist', async () => {
        const productId = '3d9b6f21-7a4e-4c8d-9f13-2b6e1a7c5d00';
        const error = new ProductNotFoundException({
          message: `Product with id ${productId} not found`,
        });
        await request(app.getHttpServer())
          .get(`/api/v1/product/${productId}`)
          .expect(HttpStatus.NOT_FOUND)
          .then(({ body }) => {
            expect(body.error.detail).toEqual(error.message);
          });
      });
    });
  });

  describe('DELETE - /product/:id', () => {
    describe('Success cases', () => {
      it('should delete a product by id', async () => {
        const productId = '8f3c2a91-4b7d-4e6f-8c21-9a5d3b7e2f10';
        await request(app.getHttpServer())
          .delete(`/api/v1/product/${productId}`)
          .auth(adminToken, { type: 'bearer' })
          .expect(HttpStatus.OK);
      });
    });

    describe('Error cases', () => {
      it('should return an error if the product to be deleted does not exist', async () => {
        const productId = '8f3c2a91-4b7d-4e6f-8c21-9a5d3b7e2f00';
        const error = new EntityNotFoundException(productId);
        await request(app.getHttpServer())
          .delete(`/api/v1/product/${productId}`)
          .auth(adminToken, { type: 'bearer' })
          .expect(HttpStatus.NOT_FOUND)
          .then(({ body }) => {
            expect(body.error.detail).toEqual(error.message);
          });
      });

      it('should throw an error if a regular user tries to access the endpoint', async () => {
        const productId = '3d9b6f21-7a4e-4c8d-9f13-2b6e1a7c5d11';
        await request(app.getHttpServer())
          .delete(`/api/v1/product/${productId}`)
          .auth(regularToken, { type: 'bearer' })
          .expect(HttpStatus.INTERNAL_SERVER_ERROR);
      });
    });
  });
});
