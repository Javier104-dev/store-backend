import { CartItemNotFoundException } from '@module/cart/infrastructure/exception/cart-item-not-found.exception';
import { ProductNotFoundException } from '@module/product/infrastructure/exception/product-not-found.exception';
import {
  ForbiddenException,
  HttpStatus,
  INestApplication,
} from '@nestjs/common';
import request from 'supertest';

import { loadFixtures } from '@data/util/fixture-loader';

import { datasourceOptions } from '@config/orm.config';

import { createTestApp } from '@test/test.module.bootstrapper';
import { createAccessToken } from '@test/test.util';

describe('Cart Module', () => {
  let app: INestApplication;

  const adminToken = createAccessToken({
    sub: '00000000-0000-0000-0000-00000000000A',
  });

  const regularToken = createAccessToken({
    sub: '00000000-0000-0000-0000-00000000000B',
  });

  const regularToken2 = createAccessToken({
    sub: '00000000-0000-0000-0000-00000000000C',
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

  describe('GET - /cart', () => {
    describe('Success cases', () => {
      it('should return paginated carts', async () => {
        await request(app.getHttpServer())
          .get('/api/v1/cart')
          .auth(adminToken, { type: 'bearer' })
          .expect(HttpStatus.OK)
          .then(({ body }) => {
            expect(body).toEqual(
              expect.objectContaining({
                data: expect.arrayContaining([
                  expect.objectContaining({
                    type: 'cart',
                    attributes: expect.objectContaining({
                      status: expect.any(String),
                    }),
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

    describe('Error cases', () => {
      it('should throw an error if a regular user tries to access the endpoint', async () => {
        const error = new ForbiddenException({
          message: 'You are not allowed to READ-ALL this resource',
        });
        await request(app.getHttpServer())
          .get('/api/v1/cart')
          .auth(regularToken, { type: 'bearer' })
          .expect(HttpStatus.FORBIDDEN)
          .then(({ body }) => {
            expect(body.error.detail).toEqual(error.message);
          });
      });
    });
  });

  describe('GET - /cart/user', () => {
    describe('Success cases', () => {
      it('should return the active cart for the user', async () => {
        await request(app.getHttpServer())
          .get('/api/v1/cart/user')
          .auth(regularToken, { type: 'bearer' })
          .expect(HttpStatus.OK)
          .then(({ body }) => {
            expect(body).toEqual(
              expect.objectContaining({
                data: expect.objectContaining({
                  type: 'cart',
                  id: expect.any(String),
                  attributes: expect.objectContaining({
                    status: 'active',
                  }),
                  relationships: expect.objectContaining({
                    items: expect.objectContaining({
                      data: expect.arrayContaining([
                        expect.objectContaining({
                          type: 'items',
                          id: expect.any(String),
                        }),
                      ]),
                    }),
                  }),
                }),
                included: expect.arrayContaining([
                  expect.objectContaining({
                    type: 'items',
                  }),
                  expect.objectContaining({
                    type: 'product',
                  }),
                ]),
              }),
            );
            expect(body.included).toHaveLength(4);
          });
      });

      it('should return an empty cart if the user does not have an active cart', async () => {
        await request(app.getHttpServer())
          .get('/api/v1/cart/user')
          .auth(regularToken2, { type: 'bearer' })
          .expect(HttpStatus.OK)
          .then(({ body }) => {
            expect(body.data).not.toHaveProperty('id');
          });
      });
    });

    describe('Error cases', () => {
      it('should throw an error if a admin user tries to access the endpoint', async () => {
        const error = new ForbiddenException({
          message: 'You are not allowed to READ this resource',
        });
        await request(app.getHttpServer())
          .get('/api/v1/cart/user')
          .auth(adminToken, { type: 'bearer' })
          .expect(HttpStatus.FORBIDDEN)
          .then(({ body }) => {
            expect(body.error.detail).toEqual(error.message);
          });
      });
    });
  });

  describe('POST - /cart/item', () => {
    describe('Success cases', () => {
      it('should add a cart item to the active cart', async () => {
        const newCartItem = {
          productId: '3d9b6f21-7a4e-4c8d-9f13-2b6e1a7c5d44',
          quantity: 2,
        };
        await request(app.getHttpServer())
          .post('/api/v1/cart/item')
          .auth(regularToken, { type: 'bearer' })
          .send(newCartItem)
          .expect(HttpStatus.CREATED)
          .then(({ body }) => {
            expect(body).toEqual(
              expect.objectContaining({
                data: expect.objectContaining({
                  type: 'cartitem',
                  id: expect.any(String),
                  attributes: expect.objectContaining({
                    quantity: expect.any(Number),
                    unitPrice: expect.any(Number),
                  }),
                }),
                links: { self: expect.any(String) },
              }),
            );
          });
      });

      it('should create an active cart when adding a cart item if none exists', async () => {
        const newCartItem = {
          productId: '3d9b6f21-7a4e-4c8d-9f13-2b6e1a7c5d44',
          quantity: 2,
        };
        await request(app.getHttpServer())
          .post('/api/v1/cart/item')
          .auth(regularToken2, { type: 'bearer' })
          .send(newCartItem)
          .expect(HttpStatus.CREATED)
          .then(({ body }) => {
            expect(body).toEqual(
              expect.objectContaining({
                data: expect.objectContaining({
                  type: 'cartitem',
                  id: expect.any(String),
                  attributes: expect.objectContaining({
                    quantity: expect.any(Number),
                    unitPrice: expect.any(Number),
                  }),
                }),
                links: { self: expect.any(String) },
              }),
            );
          });
      });

      it('should update the existing cart item', async () => {
        const newCartItem = {
          productId: '8f3c2a91-4b7d-4e6f-8c21-9a5d3b7e2f10',
          quantity: 12,
        };
        await request(app.getHttpServer())
          .post('/api/v1/cart/item')
          .auth(regularToken, { type: 'bearer' })
          .send(newCartItem)
          .expect(HttpStatus.CREATED)
          .then(({ body }) => {
            expect(body).toEqual(
              expect.objectContaining({
                data: expect.objectContaining({
                  type: 'cartitem',
                  id: expect.any(String),
                  attributes: expect.objectContaining({
                    quantity: 22,
                    unitPrice: expect.any(Number),
                  }),
                }),
                links: { self: expect.any(String) },
              }),
            );
          });
      });
    });

    describe('Error cases', () => {
      it('should throw an error when adding a cart item if the product does not exist', async () => {
        const newCartItem = {
          productId: '6f2c9d41-8b73-4e56-a1f9-3d7c5b8e2a14',
          quantity: 2,
        };
        const error = new ProductNotFoundException({
          message: `Product with id ${newCartItem.productId} not found`,
        });
        await request(app.getHttpServer())
          .post('/api/v1/cart/item')
          .auth(regularToken, { type: 'bearer' })
          .send(newCartItem)
          .expect(HttpStatus.NOT_FOUND)
          .then(({ body }) => {
            expect(body.error.detail).toEqual(error.message);
          });
      });

      it('should throw an error if a admin user tries to access the endpoint', async () => {
        const error = new ForbiddenException({
          message: 'You are not allowed to CREATE this resource',
        });
        await request(app.getHttpServer())
          .post('/api/v1/cart/item')
          .auth(adminToken, { type: 'bearer' })
          .expect(HttpStatus.FORBIDDEN)
          .then(({ body }) => {
            expect(body.error.detail).toEqual(error.message);
          });
      });
    });
  });

  describe('PATCH - /cart/item/:id', () => {
    describe('Success cases', () => {
      it('should update an existing cart item', async () => {
        const cartItemId = '91d4c3a8-5f76-4a12-b0f4-7e2d8b1f9c65';
        const updateCartItem = {
          quantity: 30,
        };
        await request(app.getHttpServer())
          .patch(`/api/v1/cart/item/${cartItemId}`)
          .auth(regularToken, { type: 'bearer' })
          .send(updateCartItem)
          .expect(HttpStatus.OK)
          .then(({ body }) => {
            expect(body).toEqual(
              expect.objectContaining({
                data: expect.objectContaining({
                  type: 'cartitem',
                  id: expect.any(String),
                  attributes: expect.objectContaining({
                    quantity: updateCartItem.quantity,
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
      it('should return an error when updating a non-existing cart item', async () => {
        const cartItemId = 'c4f8a2e1-7b93-4d6f-9a52-1e8c7f3b6d04';
        const updateCartItem = {
          quantity: 30,
        };
        const error = new CartItemNotFoundException({
          message: `Cart item with id ${cartItemId} not found`,
        });
        await request(app.getHttpServer())
          .patch(`/api/v1/cart/item/${cartItemId}`)
          .auth(regularToken, { type: 'bearer' })
          .send(updateCartItem)
          .expect(HttpStatus.NOT_FOUND)
          .then(({ body }) => {
            expect(body.error.detail).toEqual(error.message);
          });
      });

      it('should throw an error if a admin user tries to access the endpoint', async () => {
        const cartItemId = '91d4c3a8-5f76-4a12-b0f4-7e2d8b1f9c65';
        const error = new ForbiddenException({
          message: 'You are not allowed to UPDATE this resource',
        });
        await request(app.getHttpServer())
          .patch(`/api/v1/cart/item/${cartItemId}`)
          .auth(adminToken, { type: 'bearer' })
          .expect(HttpStatus.FORBIDDEN)
          .then(({ body }) => {
            expect(body.error.detail).toEqual(error.message);
          });
      });
    });
  });

  describe('DELETE - /cart/item/:id', () => {
    describe('Success cases', () => {
      it('should delete a cart item by id', async () => {
        const storeId = '91d4c3a8-5f76-4a12-b0f4-7e2d8b1f9c65';
        await request(app.getHttpServer())
          .delete(`/api/v1/cart/item/${storeId}`)
          .auth(regularToken, { type: 'bearer' })
          .expect(HttpStatus.OK);
      });
    });

    describe('Error cases', () => {
      it('should return not found when deleting a non-existing cart item', async () => {
        const storeyId = '6f1a9c2e-8b7d-4f3a-9c21-3e7d2a6b4c8v';
        const error = new CartItemNotFoundException({
          message: `Cart item with id ${storeyId} not found`,
        });
        await request(app.getHttpServer())
          .delete(`/api/v1/cart/item/${storeyId}`)
          .auth(regularToken, { type: 'bearer' })
          .expect(HttpStatus.NOT_FOUND)
          .then(({ body }) => {
            expect(body.error.detail).toEqual(error.message);
          });
      });

      it('should throw an error if a admin user tries to access the endpoint', async () => {
        const cartItemId = '91d4c3a8-5f76-4a12-b0f4-7e2d8b1f9c65';
        const error = new ForbiddenException({
          message: 'You are not allowed to DELETE this resource',
        });
        await request(app.getHttpServer())
          .delete(`/api/v1/cart/item/${cartItemId}`)
          .auth(adminToken, { type: 'bearer' })
          .expect(HttpStatus.FORBIDDEN)
          .then(({ body }) => {
            expect(body.error.detail).toEqual(error.message);
          });
      });
    });
  });
});
