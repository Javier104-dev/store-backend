import { Category } from '@module/category/domain/category.entity';
import { CreateProductDto } from '@module/product/application/dto/create-product.dto';
import { UpdateProductDto } from '@module/product/application/dto/update-product.dto';
import { PRODUCT_UPLOAD_FOLDER } from '@module/product/domain/product.constants';
import { ProductNotFoundException } from '@module/product/infrastructure/exception/product-not-found.exception';
import { HttpStatus, INestApplication } from '@nestjs/common';
import request from 'supertest';

import { loadFixtures } from '@data/util/fixture-loader';

import { datasourceOptions } from '@config/orm.config';

import {
  createTestApp,
  uploadFileServiceMock,
} from '@test/test.module.bootstrapper';
import { createAccessToken } from '@test/test.util';

describe('Catalog Module', () => {
  let app: INestApplication;

  const adminToken = createAccessToken({
    sub: '00000000-0000-0000-0000-00000000000X',
  });

  const regularToken = createAccessToken({
    sub: '00000000-0000-0000-0000-00000000000Y',
  });

  const adminToken2 = createAccessToken({
    sub: '00000000-0000-0000-0000-00000000000Z',
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

  describe('GET - /catalog/categories', () => {
    describe('Success cases', () => {
      it('should return paginated categories with their products and their relations', async () => {
        const RELATIONS_PRODUCT = 'products';
        const RELATIONS_UPLOAD = 'upload';
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
                          type: RELATIONS_PRODUCT,
                        }),
                      ]),
                    }),
                  }),
                }),
              ]),
              included: expect.arrayContaining([
                expect.objectContaining({
                  type: RELATIONS_PRODUCT,
                  relationships: expect.objectContaining({
                    upload: expect.objectContaining({
                      data: expect.arrayContaining([
                        expect.objectContaining({
                          type: RELATIONS_UPLOAD,
                        }),
                      ]),
                    }),
                  }),
                }),
                expect.objectContaining({
                  type: RELATIONS_UPLOAD,
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
      it('should be able to create a product without categories and without images', async () => {
        const product = {
          name: 'new product',
          description: 'description',
          price: 100,
        };
        const RELATIONS_STORE = 'store';
        const RELATIONS_PRODUCT = 'product';
        await request(app.getHttpServer())
          .post('/api/v1/catalog/product')
          .auth(adminToken, { type: 'bearer' })
          .send(product)
          .expect(HttpStatus.CREATED)
          .then(({ body }) => {
            const expectedResponse = expect.objectContaining({
              data: expect.objectContaining({
                type: RELATIONS_PRODUCT,
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
                    data: expect.arrayContaining([]),
                  }),
                }),
              }),
              included: expect.arrayContaining([
                expect.objectContaining({
                  type: RELATIONS_STORE,
                }),
              ]),
              links: expect.objectContaining({
                self: expect.any(String),
              }),
            });
            expect(body).toEqual(expectedResponse);
          });
      });

      it('should be able to create a product with categories and images', async () => {
        const product = {
          name: 'new product',
          description: 'description',
          price: 100,
          categoryIds: [
            'd8b4e1a2-9c73-4f5b-a6e1-2b7c9d0f3a84',
            'a7d1e5c9-2b84-4c6f-b0e3-91f2d8a7c6b4',
          ],
        };
        const mockImage1: Express.Multer.File = {
          fieldname: 'image',
          originalname: 'test1.jpg',
          encoding: '7bit',
          mimetype: 'image/jpeg',
          size: 2000000,
          buffer: Buffer.from('testImage'),
          stream: null,
          destination: '',
          filename: 'test.jpg',
          path: '',
        };
        const mockImage2: Express.Multer.File = {
          fieldname: 'image',
          originalname: 'test2.jpg',
          encoding: '7bit',
          mimetype: 'image/jpeg',
          size: 2000000,
          buffer: Buffer.from('testImage'),
          stream: null,
          destination: '',
          filename: 'test.jpg',
          path: '',
        };

        uploadFileServiceMock.uploadFile
          .mockResolvedValueOnce(
            `${PRODUCT_UPLOAD_FOLDER}/d7d30498-4c4d-44b2-a54a-99c892d74191.jpg`,
          )
          .mockResolvedValueOnce(
            `${PRODUCT_UPLOAD_FOLDER}/a8c11432-1e2f-4f77-91aa-2bc55d991234.jpg`,
          );

        const RELATIONS_STORE = 'store';
        const RELATIONS_CATEGORY = 'categories';
        const RELATIONS_PRODUCT = 'product';
        await request(app.getHttpServer())
          .post('/api/v1/catalog/product')
          .auth(adminToken, { type: 'bearer' })
          .field(product)
          .attach('images', mockImage1.buffer, mockImage1.originalname)
          .attach('images', mockImage2.buffer, mockImage2.originalname)
          .expect(HttpStatus.CREATED)
          .then(({ body }) => {
            const expectedResponse = expect.objectContaining({
              data: expect.objectContaining({
                type: RELATIONS_PRODUCT,
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
            expect(uploadFileServiceMock.uploadFile).toHaveBeenNthCalledWith(
              1,
              expect.objectContaining({
                originalname: mockImage1.originalname,
              }),
              PRODUCT_UPLOAD_FOLDER,
            );
            expect(uploadFileServiceMock.uploadFile).toHaveBeenNthCalledWith(
              2,
              expect.objectContaining({
                originalname: mockImage2.originalname,
              }),
              PRODUCT_UPLOAD_FOLDER,
            );
          });
      });
    });

    describe('Error cases', () => {
      it('should throw an error when attempting to create a product without having a store', async () => {
        const product: CreateProductDto = {
          name: 'new store',
          description: 'description',
          price: 100,
        };
        await request(app.getHttpServer())
          .post('/api/v1/catalog/product')
          .auth(adminToken2, { type: 'bearer' })
          .send(product)
          .expect(HttpStatus.NOT_FOUND);
      });

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
      it('should be able to update a product and add categories and images', async () => {
        const productId = 'c1a7e4d2-9f6b-4a33-8b52-7d1c9e4f2a88';
        const product = {
          name: 'updated name',
          description: 'updated description',
          price: 10,
          categoryIds: [
            '3f9c2d1a-6b47-4f1e-9a32-8c5e7d4b9120',
            'd8b4e1a2-9c73-4f5b-a6e1-2b7c9d0f3a84',
          ],
        };
        const RELATIONS_PRODUCT = 'product';
        const mockImage1: Express.Multer.File = {
          fieldname: 'image',
          originalname: 'test1.jpg',
          encoding: '7bit',
          mimetype: 'image/jpeg',
          size: 2000000,
          buffer: Buffer.from('testImage'),
          stream: null,
          destination: '',
          filename: 'test.jpg',
          path: '',
        };

        uploadFileServiceMock.uploadFile.mockResolvedValueOnce(
          `${PRODUCT_UPLOAD_FOLDER}/d7d30498-4c4d-44b2-a54a-99c892d74191.jpg`,
        );

        await request(app.getHttpServer())
          .patch(`/api/v1/catalog/product/${productId}`)
          .auth(adminToken, { type: 'bearer' })
          .field(product)
          .attach('images', mockImage1.buffer, mockImage1.originalname)
          .expect(HttpStatus.OK)
          .then(({ body }) => {
            const expectedResponse = expect.objectContaining({
              data: expect.objectContaining({
                type: RELATIONS_PRODUCT,
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
            expect(uploadFileServiceMock.uploadFile).toHaveBeenNthCalledWith(
              1,
              expect.objectContaining({
                originalname: mockImage1.originalname,
              }),
              PRODUCT_UPLOAD_FOLDER,
            );
          });
      });

      it('should be able to update the categories and images of a product', async () => {
        const productId = 'c1a7e4d2-9f6b-4a33-8b52-7d1c9e4f2a88';
        const product = {
          name: 'updated name',
          description: 'updated description',
          price: 10,
          categoryIds: [
            '5c2a9f8e-7d31-4b6a-8e90-3f4d1c7b2a65',
            'd8b4e1a2-9c73-4f5b-a6e1-2b7c9d0f3a84',
          ],
        };
        const RELATIONS_PRODUCT = 'product';
        const mockImage1: Express.Multer.File = {
          fieldname: 'image',
          originalname: 'test3.jpg',
          encoding: '7bit',
          mimetype: 'image/jpeg',
          size: 2000000,
          buffer: Buffer.from('testImage'),
          stream: null,
          destination: '',
          filename: 'test3.jpg',
          path: '',
        };

        uploadFileServiceMock.uploadFile.mockResolvedValueOnce(
          `${PRODUCT_UPLOAD_FOLDER}/d7d30498-4c4d-44b2-a54a-99c892d74191.jpg`,
        );

        await request(app.getHttpServer())
          .patch(`/api/v1/catalog/product/${productId}`)
          .auth(adminToken, { type: 'bearer' })
          .field(product)
          .attach('images', mockImage1.buffer, mockImage1.originalname)
          .expect(HttpStatus.OK)
          .then(({ body }) => {
            const expectedResponse = expect.objectContaining({
              data: expect.objectContaining({
                type: RELATIONS_PRODUCT,
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

      it('should be able to update a product and remove all its categories and images', async () => {
        const productId = '8f3c2a91-4b7d-4e6f-8c21-9a5d3b7e2f10';
        const product = {
          name: 'updated name',
          description: 'updated description',
          price: 10,
        };
        const RELATIONS_PRODUCT = 'product';
        await request(app.getHttpServer())
          .patch(`/api/v1/catalog/product/${productId}`)
          .auth(adminToken, { type: 'bearer' })
          .send(product)
          .expect(HttpStatus.OK)
          .then(({ body }) => {
            const expectedResponse = expect.objectContaining({
              data: expect.objectContaining({
                type: RELATIONS_PRODUCT,
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
        const error = new ProductNotFoundException({
          message: `Product with id ${productId} not found`,
        });
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
