import { SignUpDto } from '@module/iam/authentication/application/dto/sign-up.dto';
import { CouldNotSignUpException } from '@module/iam/authentication/infrastructure/cognito/exception/could-not-sign-up.exception';
import { HttpStatus, INestApplication } from '@nestjs/common';
import request from 'supertest';

import { loadFixtures } from '@data/util/fixture-loader';

import { setupApp } from '@config/app.config';
import { datasourceOptions } from '@config/orm.config';

import {
  identityProviderServiceMock,
  testModuleBootstrapper,
} from '@test/test.module.bootstrapper';

describe('Admin', () => {
  let app: INestApplication;

  beforeAll(async () => {
    process.env.AUTH_ALLOWED_EMAIL_DOMAINS =
      'test.com,example.com,account.com,biggertech.co';
    const moduleRef = await testModuleBootstrapper();
    app = moduleRef.createNestApplication();
    setupApp(app);
    await app.init();
  });

  beforeEach(async () => {
    await loadFixtures(`${__dirname}/fixture/super-admin`, datasourceOptions);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('POST - /auth/sign-up', () => {
    it('If the identity provider fails, it should allow the first user to sign up', async () => {
      const signUpDto = {
        username: '_test_john@biggertech.co',
        password: '$Test123',
      } as SignUpDto;

      identityProviderServiceMock.signUp.mockRejectedValueOnce(
        new CouldNotSignUpException({ message: 'Could not sign up' }),
      );
      await request(app.getHttpServer())
        .post('/api/v1/auth/sign-up')
        .send(signUpDto)
        .expect(HttpStatus.INTERNAL_SERVER_ERROR);

      const externalId = '00000000-0000-0000-0000-000000000001';
      identityProviderServiceMock.signUp.mockResolvedValueOnce({
        externalId,
      });
      await request(app.getHttpServer())
        .post('/api/v1/auth/sign-up')
        .send(signUpDto)
        .expect(HttpStatus.CREATED)
        .then(({ body }) => {
          const expectedResponse = expect.objectContaining({
            data: expect.objectContaining({
              attributes: expect.objectContaining({
                username: signUpDto.username,
                externalId,
              }),
            }),
          });
          expect(body).toEqual(expectedResponse);
        });
    });

    it('should allow only the first user to sign up', async () => {
      const externalId = '00000000-0000-0000-0000-000000000001';
      identityProviderServiceMock.signUp.mockResolvedValueOnce({
        externalId,
      });

      const signUpDtoFirst = {
        username: '_test_john@biggertech.co',
        password: '$Test123',
      } as SignUpDto;

      const signUpDtoSecond = {
        username: '_test_jane@biggertech.co',
        password: '$Test123',
      } as SignUpDto;

      await request(app.getHttpServer())
        .post('/api/v1/auth/sign-up')
        .send(signUpDtoFirst)
        .expect(HttpStatus.CREATED)
        .then(({ body }) => {
          const expectedResponse = expect.objectContaining({
            data: expect.objectContaining({
              attributes: expect.objectContaining({
                username: signUpDtoFirst.username,
                externalId,
              }),
            }),
          });
          expect(body).toEqual(expectedResponse);
        });

      await request(app.getHttpServer())
        .post('/api/v1/auth/sign-up')
        .send(signUpDtoSecond)
        .expect(HttpStatus.FORBIDDEN);
    });
  });
});
