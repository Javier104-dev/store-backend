import { CreateCategoryDto } from '@module/category/application/dto/create-category.dto';
import { UpdateCategoryDto } from '@module/category/application/dto/update-category.dto';
import { Category } from '@module/category/domain/category.entity';
import { HttpStatus, INestApplication } from '@nestjs/common';
import request from 'supertest';

import { loadFixtures } from '@data/util/fixture-loader';

import EntityNotFoundException from '@common/base/infrastructure/database/exception/not-found.exception';

import { datasourceOptions } from '@config/orm.config';

import { createTestApp } from '@test/test.module.bootstrapper';
import { createAccessToken } from '@test/test.util';

describe('Category Module', () => {
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

  describe('GET - /category', () => {
    describe('Success cases', () => {
      it('should return paginated categories', async () => {
        await request(app.getHttpServer())
          .get('/api/v1/category')
          .expect(HttpStatus.OK)
          .then(({ body }) => {
            expect(body).toEqual(
              expect.objectContaining({
                data: expect.arrayContaining([
                  expect.objectContaining({
                    attributes: expect.objectContaining({
                      name: expect.any(String),
                    }),
                    type: Category.getEntityName(),
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

      it('should filter categories by name', async () => {
        const categoryName = 'category2';
        await request(app.getHttpServer())
          .get(`/api/v1/category?filter[name]=${categoryName}`)
          .expect(HttpStatus.OK)
          .then(({ body }) => {
            expect(body).toEqual(
              expect.objectContaining({
                data: expect.arrayContaining([
                  expect.objectContaining({
                    type: Category.getEntityName(),
                    attributes: expect.objectContaining({
                      name: categoryName,
                    }),
                  }),
                ]),
              }),
            );
          });
      });
    });
  });

  describe('GET - /category/:id', () => {
    describe('Success cases', () => {
      it('should return a category by id', async () => {
        const categoryId = '5c2a9f8e-7d31-4b6a-8e90-3f4d1c7b2a65';
        await request(app.getHttpServer())
          .get(`/api/v1/category/${categoryId}`)
          .expect(HttpStatus.OK)
          .then(({ body }) => {
            expect(body).toEqual(
              expect.objectContaining({
                data: expect.objectContaining({
                  type: Category.getEntityName(),
                  id: categoryId,
                }),
              }),
            );
          });
      });
    });

    describe('Error cases', () => {
      it('should return an error if the category with the given ID does not exist', async () => {
        const categoryId = 'd8b4e1a2-9c73-4f5b-a6e1-2b7c9d0f3a10';
        const error = new EntityNotFoundException(categoryId);
        await request(app.getHttpServer())
          .get(`/api/v1/category/${categoryId}`)
          .expect(HttpStatus.NOT_FOUND)
          .then(({ body }) => {
            expect(body.error.detail).toEqual(error.message);
          });
      });
    });
  });

  describe('POST - /category', () => {
    describe('Success cases', () => {
      it('should create a new category', async () => {
        const category: CreateCategoryDto = {
          name: 'new category',
        };
        await request(app.getHttpServer())
          .post('/api/v1/category')
          .auth(adminToken, { type: 'bearer' })
          .send(category)
          .expect(HttpStatus.CREATED)
          .then(({ body }) => {
            expect(body).toEqual(
              expect.objectContaining({
                data: expect.objectContaining({
                  type: Category.getEntityName(),
                  attributes: expect.objectContaining({
                    name: category.name,
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
      it('should return an error when a regular user attempts to create a category', async () => {
        const category: CreateCategoryDto = {
          name: 'new category',
        };
        await request(app.getHttpServer())
          .post('/api/v1/category')
          .auth(regularToken, { type: 'bearer' })
          .send(category)
          .expect(HttpStatus.INTERNAL_SERVER_ERROR);
      });
    });
  });

  describe('PATCH - /category/:id', () => {
    describe('Success cases', () => {
      it('should update an existing category', async () => {
        const categoryId = '5c2a9f8e-7d31-4b6a-8e90-3f4d1c7b2a65';
        const category: UpdateCategoryDto = {
          name: 'category updated',
        };
        await request(app.getHttpServer())
          .patch(`/api/v1/category/${categoryId}`)
          .auth(adminToken, { type: 'bearer' })
          .send(category)
          .expect(HttpStatus.OK)
          .then(({ body }) => {
            expect(body).toEqual(
              expect.objectContaining({
                data: expect.objectContaining({
                  type: Category.getEntityName(),
                  id: categoryId,
                  attributes: expect.objectContaining({
                    name: category.name,
                    updatedAt: expect.any(String),
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
      it('should throw an error if the category to update does not exist.', async () => {
        const categoryId = '5c2a9f8e-7d31-4b6a-8e90-3f4d1c7b2a10';
        const error = new EntityNotFoundException(categoryId);
        const category: UpdateCategoryDto = {
          name: 'new category',
        };
        await request(app.getHttpServer())
          .patch(`/api/v1/category/${categoryId}`)
          .auth(adminToken, { type: 'bearer' })
          .send(category)
          .expect(HttpStatus.NOT_FOUND)
          .then(({ body }) => {
            expect(body.error.detail).toEqual(error.message);
          });
      });

      it('should throw an error if a regular user tries to access the endpoint', async () => {
        const categoryId = '5c2a9f8e-7d31-4b6a-8e90-3f4d1c7b2a10';
        const updateStore: UpdateCategoryDto = {
          name: 'updated name',
        };
        await request(app.getHttpServer())
          .patch(`/api/v1/category/${categoryId}`)
          .auth(regularToken, { type: 'bearer' })
          .send(updateStore)
          .expect(HttpStatus.INTERNAL_SERVER_ERROR);
      });
    });
  });

  describe('DELETE - /category/:id', () => {
    describe('Success cases', () => {
      it('should delete a category by id', async () => {
        const categoryId = '5c2a9f8e-7d31-4b6a-8e90-3f4d1c7b2a65';
        await request(app.getHttpServer())
          .delete(`/api/v1/category/${categoryId}`)
          .auth(adminToken, { type: 'bearer' })
          .expect(HttpStatus.OK);
      });
    });

    describe('Error cases', () => {
      it('should return an error if the category to be deleted does not exist', async () => {
        const categoryId = '5c2a9f8e-7d31-4b6a-8e90-3f4d1c7b2a22';
        const error = new EntityNotFoundException(categoryId);
        await request(app.getHttpServer())
          .delete(`/api/v1/category/${categoryId}`)
          .auth(adminToken, { type: 'bearer' })
          .expect(HttpStatus.NOT_FOUND)
          .then(({ body }) => {
            expect(body.error.detail).toEqual(error.message);
          });
      });

      it('should return an error when a regular user attempts to delete a category', async () => {
        const categoryId = '5c2a9f8e-7d31-4b6a-8e90-3f4d1c7b2a65';
        await request(app.getHttpServer())
          .delete(`/api/v1/category/${categoryId}`)
          .auth(regularToken, { type: 'bearer' })
          .expect(HttpStatus.INTERNAL_SERVER_ERROR);
      });
    });
  });
});
