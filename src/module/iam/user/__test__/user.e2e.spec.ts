import { UserDto } from '@module/iam/user/application/dto/user.dto';
import { User } from '@module/iam/user/domain/user.entity';
import { HttpStatus, INestApplication } from '@nestjs/common';
import request from 'supertest';

import { loadFixtures } from '@data/util/fixture-loader';

import { setupApp } from '@config/app.config';
import { datasourceOptions } from '@config/orm.config';

import { testModuleBootstrapper } from '@test/test.module.bootstrapper';
import { createAccessToken } from '@test/test.util';

describe('User Module', () => {
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

  describe('GET - /user', () => {
    it('should return paginated users', async () => {
      await request(app.getHttpServer())
        .get('/api/v1/user?page[size]=10')
        .auth(adminToken, { type: 'bearer' })
        .expect(HttpStatus.OK)
        .then(({ body }) => {
          const expectedResponse = expect.objectContaining({
            data: expect.arrayContaining([
              expect.objectContaining({
                type: User.getEntityName(),
                id: expect.any(String),
                attributes: expect.objectContaining({
                  username: expect.any(String),
                  externalId: expect.any(String),
                  roles: expect.arrayContaining([expect.any(String)]),
                  createdAt: expect.any(String),
                  updatedAt: expect.any(String),
                  deletedAt: null,
                  isVerified: expect.any(Boolean),
                }),
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

    it('should allow to filter by attributes', async () => {
      const username = 'admin';

      await request(app.getHttpServer())
        .get(`/api/v1/user?page[size]=10&filter[username]=${username}`)
        .auth(adminToken, { type: 'bearer' })
        .expect(HttpStatus.OK)
        .then(({ body }) => {
          const expectedResponse = expect.objectContaining({
            data: expect.arrayContaining([
              expect.objectContaining({
                attributes: expect.objectContaining({
                  username,
                }),
              }),
            ]),
          });
          expect(body).toEqual(expectedResponse);
        });
    });

    it('should allow to sort by attributes', async () => {
      const firstUser = { username: '' } as UserDto;
      const lastUser = { username: '' } as UserDto;
      let pageCount: number;

      await request(app.getHttpServer())
        .get('/api/v1/user?sort[username]=DESC&page[size]=10')
        .auth(adminToken, { type: 'bearer' })
        .expect(HttpStatus.OK)
        .then(({ body }) => {
          firstUser.username = body.data[0].attributes.username;
          pageCount = body.meta.pageCount;
        });

      await request(app.getHttpServer())
        .get(
          `/api/v1/user?page[size]=10&sort[username]=ASC&page[number]=${pageCount}`,
        )
        .auth(adminToken, { type: 'bearer' })
        .expect(HttpStatus.OK)
        .then(({ body }) => {
          const resources = body.data;
          lastUser.username =
            resources[resources.length - 1].attributes.username;
          expect(lastUser.username).toBe(firstUser.username);
        });
    });

    it('should allow to select specific attributes', async () => {
      const attributes = [
        'username',
        'externalId',
        'roles',
      ] as (keyof UserDto)[];

      await request(app.getHttpServer())
        .get(
          `/api/v1/user?page[size]=10&fields[target]=${attributes.join(',')}`,
        )
        .auth(adminToken, { type: 'bearer' })
        .expect(HttpStatus.OK)
        .then(({ body }) => {
          const resourceAttributes = body.data[0].attributes;
          expect(Object.keys(resourceAttributes).length).toBe(
            attributes.length,
          );
          expect(resourceAttributes).toEqual({
            username: expect.any(String),
            externalId: expect.any(String),
            roles: expect.arrayContaining([expect.any(String)]),
          });
        });
    });
  });

  describe('GET - /user/count', () => {
    it('should return total number of users', async () => {
      await request(app.getHttpServer())
        .get('/api/v1/user/count')
        .expect(HttpStatus.OK)
        .then(({ body }) => {
          expect(body.data.attributes.count).toBe(23);
        });
    });
  });

  describe('GET - /user/me', () => {
    it('should return current user', async () => {
      await request(app.getHttpServer())
        .get('/api/v1/user/me')
        .auth(adminToken, { type: 'bearer' })
        .expect(HttpStatus.OK)
        .then(({ body }) => {
          const expectedResponse = expect.objectContaining({
            data: expect.objectContaining({
              attributes: expect.objectContaining({
                username: 'admin',
                externalId: expect.any(String),
                isVerified: expect.any(Boolean),
                roles: expect.arrayContaining(['admin']),
                createdAt: expect.any(String),
                updatedAt: expect.any(String),
                deletedAt: null,
              }),
              id: expect.any(String),
              type: 'user',
            }),
            links: expect.objectContaining({
              self: expect.any(String),
            }),
          });
          expect(body).toEqual(expectedResponse);
        });
    });

    it('should throw an error if user is not authenticated', async () => {
      await request(app.getHttpServer())
        .get('/api/v1/user/me')
        .expect(HttpStatus.UNAUTHORIZED);
    });
  });
});
