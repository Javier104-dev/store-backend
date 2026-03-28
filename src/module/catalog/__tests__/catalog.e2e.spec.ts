import { Category } from '@module/category/domain/category.entity';
import { CreateProductDto } from '@module/product/application/dto/create-product.dto';
import { UpdateProductDto } from '@module/product/application/dto/update-product.dto';
import { Product } from '@module/product/domain/product.entity';
import { HttpStatus, INestApplication } from '@nestjs/common';
import request from 'supertest';

import { loadFixtures } from '@data/util/fixture-loader';

import EntityNotFoundException from '@common/base/infrastructure/database/exception/not-found.exception';

import { datasourceOptions } from '@config/orm.config';

import { createTestApp } from '@test/test.module.bootstrapper';
import { createAccessToken } from '@test/test.util';

describe('Catalog Module', () => {
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

  describe('GET - /catalog/catalog', () => {
    describe('Success cases', () => {
      it('should return paginated categories with their products and their relations', async () => {
        const RELATIONS = 'products';
        await request(app.getHttpServer())
          .get('/api/v1/catalog/categories?page[size]=2')
          .expect(HttpStatus.OK)
          .then(({ body }) => {
            const expectedResponse = expect.objectContaining({
              data: expect.arrayContaining([
                expect.objectContaining({
                  type: Category.getEntityName(),
                  id: expect.any(String),
                  attributes: expect.objectContaining({
                    name: expect.any(String),
                    createdAt: expect.any(String),
                    updatedAt: expect.any(String),
                  }),
                  relationships: expect.objectContaining({
                    products: expect.objectContaining({
                      data: expect.arrayContaining([
                        expect.objectContaining({
                          type: RELATIONS,
                        }),
                      ]),
                    }),
                  }),
                }),
              ]),
              included: expect.arrayContaining([
                expect.objectContaining({
                  type: RELATIONS,
                }),
              ]),
              links: expect.objectContaining({
                self: expect.any(String),
                next: expect.any(String),
                last: expect.any(String),
              }),
              meta: expect.objectContaining({
                pageNumber: expect.any(Number),
                pageSize: expect.any(Number),
                pageCount: expect.any(Number),
                itemCount: expect.any(Number),
              }),
            });
            expect(body).toEqual(expectedResponse);
          });
      });
    });
  });

  describe('POST - /catalog/product', () => {
    describe('Success cases', () => {
      it('should be able to create a product with its categories', async () => {
        const product: CreateProductDto = {
          name: 'new store',
          description: 'description',
          price: 100,
          categoryIds: [
            'd8b4e1a2-9c73-4f5b-a6e1-2b7c9d0f3a84',
            'a7d1e5c9-2b84-4c6f-b0e3-91f2d8a7c6b4',
          ],
        };
        const RELATIONS_STORE = 'store';
        const RELATIONS_CATEGORY = 'categories';
        await request(app.getHttpServer())
          .post('/api/v1/catalog/product')
          .auth(adminToken, { type: 'bearer' })
          .send(product)
          .expect(HttpStatus.CREATED)
          .then(({ body }) => {
            const expectedResponse = expect.objectContaining({
              data: expect.objectContaining({
                type: Product.getEntityName(),
                id: expect.any(String),
                attributes: expect.objectContaining({
                  name: product.name,
                  description: product.description,
                  price: product.price,
                  createdAt: expect.any(String),
                  updatedAt: expect.any(String),
                }),
                relationships: expect.objectContaining({
                  store: expect.objectContaining({
                    data: expect.objectContaining({
                      type: RELATIONS_STORE,
                    }),
                  }),
                  categories: expect.objectContaining({
                    data: expect.arrayContaining([
                      expect.objectContaining({
                        type: RELATIONS_CATEGORY,
                      }),
                    ]),
                  }),
                }),
              }),
              included: expect.arrayContaining([
                expect.objectContaining({
                  type: RELATIONS_STORE,
                }),
                expect.objectContaining({
                  type: RELATIONS_CATEGORY,
                }),
              ]),
              links: expect.objectContaining({
                self: expect.any(String),
              }),
            });
            expect(body).toEqual(expectedResponse);
          });
      });
    });

    describe('Error cases', () => {
      it('should throw an error if a regular user tries to access the endpoint', async () => {
        const product: CreateProductDto = {
          name: 'new store',
          description: 'description',
          price: 100,
          categoryIds: [
            'd8b4e1a2-9c73-4f5b-a6e1-2b7c9d0f3a84',
            'a7d1e5c9-2b84-4c6f-b0e3-91f2d8a7c6b4',
          ],
        };
        await request(app.getHttpServer())
          .post('/api/v1/catalog/product')
          .auth(regularToken, { type: 'bearer' })
          .send(product)
          .expect(HttpStatus.INTERNAL_SERVER_ERROR);
      });
    });
  });

  describe('PATCH - /catalog/product/:id', () => {
    describe('Success cases', () => {
      it('should be able to update a product with its categories', async () => {
        const productId = '8f3c2a91-4b7d-4e6f-8c21-9a5d3b7e2f10';
        const product: UpdateProductDto = {
          name: 'updated name',
          description: 'updated description',
          price: 10,
          categoryIds: ['d8b4e1a2-9c73-4f5b-a6e1-2b7c9d0f3a84'],
        };
        await request(app.getHttpServer())
          .patch(`/api/v1/catalog/product/${productId}`)
          .auth(adminToken, { type: 'bearer' })
          .send(product)
          .expect(HttpStatus.OK)
          .then(({ body }) => {
            const expectedResponse = expect.objectContaining({
              data: expect.objectContaining({
                type: Product.getEntityName(),
                id: expect.any(String),
                attributes: expect.objectContaining({
                  name: product.name,
                  description: product.description,
                  price: product.price,
                  createdAt: expect.any(String),
                  updatedAt: expect.any(String),
                }),
              }),
              links: expect.objectContaining({
                self: expect.any(String),
              }),
            });
            expect(body).toEqual(expectedResponse);
          });
      });
    });

    describe('Error cases', () => {
      it('should throw an error if the product to update does not exist.', async () => {
        const productId = '8f3c2a91-4b7d-4e6f-8c21-9a5d3b7e2f00';
        const error = new EntityNotFoundException(productId);
        const product: UpdateProductDto = {
          name: 'updated name',
          description: 'updated description',
          price: 10,
          categoryIds: ['d8b4e1a2-9c73-4f5b-a6e1-2b7c9d0f3a84'],
        };
        await request(app.getHttpServer())
          .patch(`/api/v1/catalog/product/${productId}`)
          .auth(adminToken, { type: 'bearer' })
          .send(product)
          .expect(HttpStatus.NOT_FOUND)
          .then(({ body }) => {
            expect(body.error.detail).toEqual(error.message);
          });
      });

      it('should throw an error if a regular user tries to access the endpoint', async () => {
        const productId = '8f3c2a91-4b7d-4e6f-8c21-9a5d3b7e2f10';
        const product: UpdateProductDto = {
          name: 'updated name',
          description: 'updated description',
          price: 10,
          categoryIds: ['d8b4e1a2-9c73-4f5b-a6e1-2b7c9d0f3a84'],
        };
        await request(app.getHttpServer())
          .patch(`/api/v1/catalog/product/${productId}`)
          .auth(regularToken, { type: 'bearer' })
          .send(product)
          .expect(HttpStatus.INTERNAL_SERVER_ERROR);
      });
    });
  });
});
