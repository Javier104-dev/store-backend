import { IConfirmPasswordDto } from '@module/iam/authentication/application/dto/confirm-password.dto.interface';
import { IConfirmUserDto } from '@module/iam/authentication/application/dto/confirm-user.dto.interface';
import { IForgotPasswordDto } from '@module/iam/authentication/application/dto/forgot-password.dto.interface';
import { IRefreshSessionResponse } from '@module/iam/authentication/application/dto/refresh-session-response.interface';
import { IRefreshSessionDto } from '@module/iam/authentication/application/dto/refresh-session.dto.interface';
import { IResendConfirmationCodeDto } from '@module/iam/authentication/application/dto/resend-confirmation-code.dto.interface';
import { ISignInResponse } from '@module/iam/authentication/application/dto/sign-in-response.interface';
import { ISignInDto } from '@module/iam/authentication/application/dto/sign-in.dto.interface';
import { SignUpDto } from '@module/iam/authentication/application/dto/sign-up.dto';
import { ISignUpDto } from '@module/iam/authentication/application/dto/sign-up.dto.interface';
import {
  TOKEN_EXPIRED_ERROR,
  USER_ALREADY_CONFIRMED_ERROR,
  USER_ALREADY_SIGNED_UP_ERROR,
} from '@module/iam/authentication/application/exception/authentication-exception-messages';
import { TokenExpiredException } from '@module/iam/authentication/application/exception/token-expired.exception';
import { UserAlreadyConfirmed } from '@module/iam/authentication/application/exception/user-already-confirmed.exception';
import { AUTHENTICATION_NAME } from '@module/iam/authentication/domain/authentication.name';
import { CodeMismatchException } from '@module/iam/authentication/infrastructure/cognito/exception/code-mismatch.exception';
import {
  CODE_MISMATCH_ERROR,
  EXPIRED_CODE_ERROR,
  INVALID_PASSWORD_ERROR,
  INVALID_REFRESH_TOKEN_ERROR,
  NEW_PASSWORD_REQUIRED_ERROR,
  PASSWORD_VALIDATION_ERROR,
  UNEXPECTED_ERROR_CODE_ERROR,
  USER_NOT_CONFIRMED_ERROR,
} from '@module/iam/authentication/infrastructure/cognito/exception/cognito-exception-messages';
import { CouldNotSignUpException } from '@module/iam/authentication/infrastructure/cognito/exception/could-not-sign-up.exception';
import { ExpiredCodeException } from '@module/iam/authentication/infrastructure/cognito/exception/expired-code.exception';
import { InvalidPasswordException } from '@module/iam/authentication/infrastructure/cognito/exception/invalid-password.exception';
import { InvalidRefreshTokenException } from '@module/iam/authentication/infrastructure/cognito/exception/invalid-refresh-token.exception';
import { NewPasswordRequiredException } from '@module/iam/authentication/infrastructure/cognito/exception/new-password-required.exception';
import { PasswordValidationException } from '@module/iam/authentication/infrastructure/cognito/exception/password-validation.exception';
import { UnexpectedErrorCodeException } from '@module/iam/authentication/infrastructure/cognito/exception/unexpected-code.exception';
import { UserNotConfirmedException } from '@module/iam/authentication/infrastructure/cognito/exception/user-not-confirmed.exception';
import { UsernameNotFoundException } from '@module/iam/user/infrastructure/database/exception/username-not-found.exception';
import { HttpStatus, INestApplication } from '@nestjs/common';
import { getDataSourceToken } from '@nestjs/typeorm';
import request from 'supertest';

import { loadFixtures } from '@data/util/fixture-loader';

import { datasourceOptions } from '@config/orm.config';

import {
  createTestApp,
  identityProviderServiceMock,
} from '@test/test.module.bootstrapper';
import { createAccessToken } from '@test/test.util';

describe('Authentication Module', () => {
  let app: INestApplication;

  beforeAll(async () => {
    process.env.AUTH_ALLOWED_EMAIL_DOMAINS = 'biggertech.co';
    app = await createTestApp();
    const dataSource = app.get(getDataSourceToken());
    await dataSource.dropDatabase();
    await dataSource.synchronize(true);
  });
  beforeEach(async () => {
    await loadFixtures(`${__dirname}/fixture`, datasourceOptions);
  });
  afterEach(() => {
    jest.clearAllMocks();
  });

  afterAll(async () => {
    delete process.env.AUTH_ALLOWED_EMAIL_DOMAINS;
    await app.close();
  });

  describe('Guards', () => {
    describe('Access Token', () => {
      it('should allow requests that contain a valid token', async () => {
        const accessToken = createAccessToken({
          sub: '00000000-0000-0000-0000-00000000000X',
        });

        await request(app.getHttpServer())
          .get('/api/v1/user?page[size]=10')
          .auth(accessToken, { type: 'bearer' })
          .expect(HttpStatus.OK);
      });

      it('should deny requests that contain an invalid token', async () => {
        const accessToken = createAccessToken({
          sub: 'non-existent-user-id',
        });

        await request(app.getHttpServer())
          .get('/api/v1/user')
          .auth(accessToken, { type: 'bearer' })
          .expect(HttpStatus.FORBIDDEN);
      });
      it('should respond with an exception if the access token is expired', async () => {
        const expiration = '0ms';
        const accessToken = createAccessToken(
          {
            sub: '00000000-0000-0000-0000-00000000000X',
          },
          { expiresIn: expiration },
        );

        await request(app.getHttpServer())
          .get('/api/v1/user')
          .auth(accessToken, { type: 'bearer' })
          .expect(HttpStatus.UNAUTHORIZED)
          .then(({ body }) => {
            expect(body.error.detail).toEqual(
              new TokenExpiredException(TOKEN_EXPIRED_ERROR).message,
            );
          });
      });
    });
  });

  describe('API', () => {
    describe('POST - /auth/create', () => {
      const superAdminAccessToken = createAccessToken({
        sub: '00000000-0000-0000-0000-00000000000A',
      });

      const adminAccessToken = createAccessToken({
        sub: '00000000-0000-0000-0000-00000000000X',
      });

      const signUpDto = {
        username: '_test_jane@biggertech.co',
        password: '$Test123',
      } as SignUpDto;

      it('Admins should not be allowed to create new accounts', async () => {
        await request(app.getHttpServer())
          .post('/api/v1/auth/create')
          .auth(adminAccessToken, { type: 'bearer' })
          .send(signUpDto)
          .expect(HttpStatus.FORBIDDEN);
      });
      it('should allow super admins to create new accounts', async () => {
        const externalId = '00000000-0000-0000-0000-000000000002';
        identityProviderServiceMock.signUp.mockResolvedValueOnce({
          externalId,
        });
        await request(app.getHttpServer())
          .post('/api/v1/auth/create')
          .auth(superAdminAccessToken, { type: 'bearer' })
          .send(signUpDto)
          .expect(HttpStatus.CREATED)
          .then(({ body }) => {
            const expectedResponse = expect.objectContaining({
              data: expect.objectContaining({
                attributes: expect.objectContaining({
                  username: signUpDto.username,
                }),
              }),
            });
            expect(body).toEqual(expectedResponse);
          });
      });

      it('should allow users to retry their sign up if the external provider failed', async () => {
        identityProviderServiceMock.signUp.mockRejectedValueOnce(
          new CouldNotSignUpException({
            message: 'Could not sign up',
          }),
        );

        const signUpDto = {
          username: '_test_jane@biggertech.co',
          password: '$Test123',
        } as SignUpDto;

        await request(app.getHttpServer())
          .post('/api/v1/auth/create')
          .auth(superAdminAccessToken, { type: 'bearer' })
          .send(signUpDto)
          .expect(HttpStatus.INTERNAL_SERVER_ERROR);

        const externalId = '00000000-0000-0000-0000-000000000002';
        identityProviderServiceMock.signUp.mockResolvedValueOnce({
          externalId,
        });

        await request(app.getHttpServer())
          .post('/api/v1/auth/create')
          .auth(superAdminAccessToken, { type: 'bearer' })
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

      it('should throw an error if user already signed up', async () => {
        const externalId = '00000000-0000-0000-0000-000000000003';
        identityProviderServiceMock.signUp.mockResolvedValueOnce({
          externalId,
        });

        const signUpDto = {
          username: '_test_thomas@biggertech.co',
          password: '$Test123',
        } as SignUpDto;

        await request(app.getHttpServer())
          .post('/api/v1/auth/create')
          .auth(superAdminAccessToken, { type: 'bearer' })
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

        await request(app.getHttpServer())
          .post('/api/v1/auth/create')
          .auth(superAdminAccessToken, { type: 'bearer' })
          .send(signUpDto)
          .expect(HttpStatus.BAD_REQUEST)
          .then(({ body }) => {
            expect(body.error.detail).toBe(USER_ALREADY_SIGNED_UP_ERROR);
            expect(body.error.source.pointer).toBe('/user/externalId');
          });
      });

      it('Should throw an error if password is invalid', async () => {
        const error = new PasswordValidationException({
          message: PASSWORD_VALIDATION_ERROR,
        });
        identityProviderServiceMock.signUp.mockRejectedValueOnce(error);
        const signUpDto: ISignUpDto = {
          username: '_test_some@biggertech.co',
          password: '123456',
        };

        await request(app.getHttpServer())
          .post('/api/v1/auth/create')
          .auth(superAdminAccessToken, { type: 'bearer' })
          .send(signUpDto)
          .expect(HttpStatus.BAD_REQUEST)
          .then(({ body }) => {
            expect(body.error.detail).toEqual(error.message);
          });
      });

      it('should throw error when email domain is not allowed', async () => {
        const invalidDomainEmail = '_test_invalid@invalid-domain.com';
        const allowedDomains =
          process.env.AUTH_ALLOWED_EMAIL_DOMAINS.split(',');
        await request(app.getHttpServer())
          .post('/api/v1/auth/sign-up')
          .send({
            username: invalidDomainEmail,
            password: 'ValidPass123!',
          })
          .expect(HttpStatus.UNAUTHORIZED)
          .then(({ body }) => {
            expect(body.error.detail).toBe(
              `Email domain not allowed. Allowed domains are: ${allowedDomains.join(
                ', ',
              )}`,
            );
          });
      });

      it('should throw error when email has no domain', async () => {
        const invalidEmail = '_test_test@';
        const allowedDomains =
          process.env.AUTH_ALLOWED_EMAIL_DOMAINS.split(',');
        await request(app.getHttpServer())
          .post('/api/v1/auth/sign-up')
          .send({
            username: invalidEmail,
            password: 'ValidPass123!',
          })
          .expect(HttpStatus.UNAUTHORIZED)
          .then(({ body }) => {
            expect(body.error.detail).toBe(
              `Email domain not allowed. Allowed domains are: ${allowedDomains.join(
                ', ',
              )}`,
            );
          });
      });
    });
    describe('POST - /auth/sign-in', () => {
      it('Should allow users to sign in when provided a correct username and password', async () => {
        const serviceResponse: ISignInResponse = {
          accessToken: 'accessToken',
          refreshToken: 'refreshToken',
        };
        identityProviderServiceMock.signIn.mockResolvedValueOnce(
          serviceResponse,
        );

        const signInDto: ISignInDto = {
          username: '_test_admin@biggertech.co',
          password: 'password',
        };

        await request(app.getHttpServer())
          .post('/api/v1/auth/sign-in')
          .send(signInDto)
          .expect(HttpStatus.OK)
          .then(({ body }) => {
            const expectedResponse = expect.objectContaining({
              data: expect.objectContaining({
                type: AUTHENTICATION_NAME,
                attributes: expect.objectContaining({
                  ...serviceResponse,
                }),
              }),
              links: expect.objectContaining({
                self: expect.any(String),
              }),
            });
            expect(body).toEqual(expectedResponse);
          });
      });

      it('Should send an UserNotFound error when provided an invalid username', async () => {
        const signInDto: ISignInDto = {
          username: 'fakeUsername',
          password: 'fakePassword',
        };
        const error = new UsernameNotFoundException({
          username: signInDto.username,
        });
        await request(app.getHttpServer())
          .post('/api/v1/auth/sign-in')
          .send(signInDto)
          .expect(HttpStatus.NOT_FOUND)
          .then(({ body }) => {
            expect(body.error.detail).toEqual(error.message);
          });
      });

      it('Should send an InvalidPassword error provided a valid user but invalid password', async () => {
        const error = new InvalidPasswordException({
          message: INVALID_PASSWORD_ERROR,
        });
        const signInDto: ISignInDto = {
          username: '_test_admin@biggertech.co',
          password: 'fakePassword',
        };

        identityProviderServiceMock.signIn.mockRejectedValueOnce(error);
        await request(app.getHttpServer())
          .post('/api/v1/auth/sign-in')
          .send(signInDto)
          .expect(HttpStatus.UNAUTHORIZED)
          .then(({ body }) => {
            expect(body.error.detail).toEqual(error.message);
          });
      });

      it('Should send an UnconfirmedUser error when user is not confirmed', async () => {
        const error = new UserNotConfirmedException({
          message: USER_NOT_CONFIRMED_ERROR,
        });
        identityProviderServiceMock.signIn.mockRejectedValueOnce(error);
        const signInDto: ISignInDto = {
          username: '_test_admin@biggertech.co',
          password: 'password',
        };

        await request(app.getHttpServer())
          .post('/api/v1/auth/sign-in')
          .send(signInDto)
          .expect(HttpStatus.FORBIDDEN)
          .then(({ body }) => {
            expect(body.error.detail).toEqual(error.message);
          });
      });

      it('Should send an UnexpectedErrorCode error when receiving uncovered error codes', async () => {
        const error = new UnexpectedErrorCodeException({
          code: UNEXPECTED_ERROR_CODE_ERROR,
        });
        identityProviderServiceMock.signIn.mockRejectedValueOnce(error);
        const signInDto: ISignInDto = {
          username: '_test_admin@biggertech.co',
          password: 'password',
        };

        await request(app.getHttpServer())
          .post('/api/v1/auth/sign-in')
          .send(signInDto)
          .expect(HttpStatus.INTERNAL_SERVER_ERROR)
          .then(({ body }) => {
            expect(body.error.detail).toEqual(error.message);
          });
      });

      it('Should send a NewPasswordRequired error when user needs to update their password', async () => {
        const error = new NewPasswordRequiredException({
          message: NEW_PASSWORD_REQUIRED_ERROR,
        });
        identityProviderServiceMock.signIn.mockRejectedValueOnce(error);
        const signInDto: ISignInDto = {
          username: '_test_admin@biggertech.co',
          password: 'password',
        };

        await request(app.getHttpServer())
          .post('/api/v1/auth/sign-in')
          .send(signInDto)
          .expect(HttpStatus.UNAUTHORIZED)
          .then(({ body }) => {
            expect(body.error.detail).toEqual(error.message);
          });
      });
    });
    describe('POST - /auth/confirm-user', () => {
      it('Should confirm a user when provided a correct confirmation code', async () => {
        const successResponse = {
          success: true,
          message: 'User successfully confirmed',
        };
        identityProviderServiceMock.confirmUser.mockResolvedValueOnce(
          successResponse,
        );
        const confirmUserDto: IConfirmUserDto = {
          username: '_test_confirm@biggertech.co',
          code: '123456',
        };

        const response = await request(app.getHttpServer())
          .post('/api/v1/auth/confirm-user')
          .send(confirmUserDto);

        expect(response.status).toBe(HttpStatus.OK);
        const expectedResponse = expect.objectContaining({
          data: expect.objectContaining({
            type: AUTHENTICATION_NAME,
            attributes: expect.objectContaining({
              ...successResponse,
            }),
          }),
          links: expect.objectContaining({
            self: expect.any(String),
          }),
        });
        expect(response.body).toEqual(expectedResponse);
      });

      it('Should send a UserAlreadyConfirmed error when trying to confirm a confirmed user', async () => {
        const username = '_test_admin@biggertech.co';
        const error = new UserAlreadyConfirmed({
          message: USER_ALREADY_CONFIRMED_ERROR,
        });
        const confirmUserDto: IConfirmUserDto = {
          username,
          code: '123456',
        };

        await request(app.getHttpServer())
          .post('/api/v1/auth/confirm-user')
          .send(confirmUserDto)
          .expect(HttpStatus.BAD_REQUEST)
          .then(({ body }) => {
            expect(body.error.detail).toEqual(error.message);
            expect(body.error.source.pointer).toEqual('/user/isVerified');
          });
      });

      it('Should send an UserNotFound error when provided an invalid username', async () => {
        const username = 'fakeUsername';
        const error = new UsernameNotFoundException({
          username,
        });
        const confirmUserDto: IConfirmUserDto = {
          username,
          code: '123456',
        };
        await request(app.getHttpServer())
          .post('/api/v1/auth/confirm-user')
          .send(confirmUserDto)
          .expect(HttpStatus.NOT_FOUND)
          .then(({ body }) => {
            expect(body.error.detail).toEqual(error.message);
          });
      });

      it('Should send a CodeMismatch error when provided an incorrect code', async () => {
        const codeMismatchError = new CodeMismatchException({
          message: CODE_MISMATCH_ERROR,
        });

        identityProviderServiceMock.confirmUser.mockImplementationOnce(
          (username: string, code: string) => {
            if (code === 'wrong-code') {
              throw codeMismatchError;
            }
            return Promise.resolve({
              success: true,
              message: 'User successfully confirmed',
            });
          },
        );

        const confirmUserDto: IConfirmUserDto = {
          username: '_test_confirm@biggertech.co',
          code: 'wrong-code',
        };

        const response = await request(app.getHttpServer())
          .post('/api/v1/auth/confirm-user')
          .send(confirmUserDto);

        expect(response.status).toBe(HttpStatus.UNAUTHORIZED);
        expect(response.body.error.detail).toEqual(CODE_MISMATCH_ERROR);
      });

      it('Should send an ExpiredCode error when provided an expired code', async () => {
        const expiredCodeError = new ExpiredCodeException({
          message: EXPIRED_CODE_ERROR,
        });

        identityProviderServiceMock.confirmUser.mockImplementationOnce(
          (username: string, code: string) => {
            if (code === 'expired-code') {
              throw expiredCodeError;
            }
            return Promise.resolve({
              success: true,
              message: 'User successfully confirmed',
            });
          },
        );

        const confirmUserDto: IConfirmUserDto = {
          username: '_test_confirm@biggertech.co',
          code: 'expired-code',
        };

        const response = await request(app.getHttpServer())
          .post('/api/v1/auth/confirm-user')
          .send(confirmUserDto);

        expect(response.status).toBe(HttpStatus.BAD_REQUEST);
        expect(response.body.error.detail).toEqual(EXPIRED_CODE_ERROR);
        expect(response.body.error.source.pointer).toEqual(
          '/confirm-password/code',
        );
      });

      it('Should respond with an UnexpectedErrorCodeException when an unexpected error occurs', async () => {
        const unexpectedError = new UnexpectedErrorCodeException({
          code: UNEXPECTED_ERROR_CODE_ERROR,
        });

        identityProviderServiceMock.confirmUser.mockImplementationOnce(
          (username: string, code: string) => {
            if (code === 'trigger-unexpected') {
              throw unexpectedError;
            }
            return Promise.resolve({
              success: true,
              message: 'User successfully confirmed',
            });
          },
        );

        const confirmUserDto: IConfirmUserDto = {
          username: '_test_confirm@biggertech.co',
          code: 'trigger-unexpected',
        };

        const response = await request(app.getHttpServer())
          .post('/api/v1/auth/confirm-user')
          .send(confirmUserDto);

        expect(response.status).toBe(HttpStatus.INTERNAL_SERVER_ERROR);
        expect(response.body.error.detail).toEqual(unexpectedError.message);
      });
    });
    describe('POST - /auth/forgot-password', () => {
      const url = '/api/v1/auth/forgot-password';
      it('Should respond with a success message when provided a username to forgot password', async () => {
        identityProviderServiceMock.forgotPassword.mockResolvedValueOnce({
          success: true,
          message: 'Password reset instructions have been sent',
        });
        const forgotPasswordDto: IForgotPasswordDto = {
          username: '_test_admin@biggertech.co',
        };
        await request(app.getHttpServer())
          .post(url)
          .send(forgotPasswordDto)
          .expect(HttpStatus.OK)
          .then(({ body }) => {
            expect(body.data.attributes.success).toEqual(true);
          });
      });
      it("Should respond with an UserNotFoundException when the user doesn't exist", async () => {
        const username = 'fakeUsername';
        const error = new UsernameNotFoundException({
          username,
        });
        const forgotPasswordDto: IForgotPasswordDto = { username };
        await request(app.getHttpServer())
          .post(url)
          .send(forgotPasswordDto)
          .expect(HttpStatus.NOT_FOUND)
          .then(({ body }) => {
            expect(body.error.detail).toEqual(error.message);
          });
      });
      it('Should respond with an UnexpectedErrorCodeException when an unexpected error occurs', async () => {
        const error = new UnexpectedErrorCodeException({
          code: UNEXPECTED_ERROR_CODE_ERROR,
        });
        identityProviderServiceMock.forgotPassword.mockRejectedValueOnce(error);
        const forgotPasswordDto: IForgotPasswordDto = {
          username: '_test_admin@biggertech.co',
        };
        await request(app.getHttpServer())
          .post(url)
          .send(forgotPasswordDto)
          .expect(HttpStatus.INTERNAL_SERVER_ERROR)
          .then(({ body }) => {
            expect(body.error.detail).toEqual(error.message);
          });
      });
    });
    describe('POST - /auth/confirm-password', () => {
      const url = '/api/v1/auth/confirm-password';
      it('Should respond with a success message when provided a username, password and code', async () => {
        identityProviderServiceMock.confirmPassword.mockResolvedValueOnce({
          success: true,
          message: 'Your password has been correctly updated',
        });
        const confirmPasswordDto: IConfirmPasswordDto = {
          username: '_test_admin@biggertech.co',
          code: '123456',
          newPassword: 'password',
        };
        await request(app.getHttpServer())
          .post(url)
          .send(confirmPasswordDto)
          .expect(HttpStatus.OK)
          .then(({ body }) => {
            expect(body.data.attributes.success).toEqual(true);
          });
      });
      it('Should respond with a CodeMismatchError when the code is invalid', async () => {
        const error = new CodeMismatchException({
          message: CODE_MISMATCH_ERROR,
        });
        identityProviderServiceMock.confirmPassword.mockRejectedValueOnce(
          error,
        );
        const confirmPasswordDto: IConfirmPasswordDto = {
          username: '_test_admin@biggertech.co',
          code: '654321',
          newPassword: 'password',
        };
        await request(app.getHttpServer())
          .post(url)
          .send(confirmPasswordDto)
          .expect(HttpStatus.UNAUTHORIZED)
          .then(({ body }) => {
            expect(body.error.detail).toEqual(error.message);
            expect(body.error.source.pointer).toContain(
              '/api/v1/auth/confirm-password',
            );
          });
      });
      it('Should respond with an UsernameNotFound error when the user does not exist', async () => {
        const username = 'fake@fake.co';
        const error = new UsernameNotFoundException({
          username,
        });
        const confirmPasswordDto: IConfirmPasswordDto = {
          username,
          code: '654321',
          newPassword: 'password',
        };
        await request(app.getHttpServer())
          .post(url)
          .send(confirmPasswordDto)
          .expect(HttpStatus.NOT_FOUND)
          .then(({ body }) => {
            expect(body.error.detail).toEqual(error.message);
          });
      });
      it('Should respond with a PasswordValidationException when password is not strong enough', async () => {
        const error = new PasswordValidationException({
          message: PASSWORD_VALIDATION_ERROR,
        });
        identityProviderServiceMock.confirmPassword.mockRejectedValueOnce(
          error,
        );
        const confirmPasswordDto: IConfirmPasswordDto = {
          username: '_test_admin@biggertech.co',
          code: '654321',
          newPassword: 'password',
        };
        await request(app.getHttpServer())
          .post(url)
          .send(confirmPasswordDto)
          .expect(HttpStatus.BAD_REQUEST)
          .then(({ body }) => {
            expect(body.error.detail).toEqual(error.message);
          });
      });
      it('Should respond with an UnexpectedErrorCodeException when an unexpected error occurs', async () => {
        const error = new UnexpectedErrorCodeException({
          code: UNEXPECTED_ERROR_CODE_ERROR,
        });
        identityProviderServiceMock.confirmPassword.mockRejectedValueOnce(
          error,
        );
        const forgotPasswordDto: IConfirmPasswordDto = {
          username: '_test_admin@biggertech.co',
          code: '654321',
          newPassword: 'password',
        };
        await request(app.getHttpServer())
          .post(url)
          .send(forgotPasswordDto)
          .expect(HttpStatus.INTERNAL_SERVER_ERROR)
          .then(({ body }) => {
            expect(body.error.detail).toEqual(error.message);
          });
      });
      it('Should respond with an ExpiredCodeException when the code has expired', async () => {
        const error = new ExpiredCodeException({
          message: EXPIRED_CODE_ERROR,
        });
        identityProviderServiceMock.confirmPassword.mockRejectedValueOnce(
          error,
        );
        const confirmPasswordDto: IConfirmPasswordDto = {
          username: '_test_admin@biggertech.co',
          code: '654321',
          newPassword: 'password',
        };
        await request(app.getHttpServer())
          .post(url)
          .send(confirmPasswordDto)
          .expect(HttpStatus.BAD_REQUEST)
          .then(({ body }) => {
            expect(body.error.detail).toEqual(error.message);
          });
      });
    });
    describe('POST - /auth/resend-confirmation-code', () => {
      const url = '/api/v1/auth/resend-confirmation-code';
      it('Should resend the confirmation code when requested', async () => {
        const successResponse = {
          success: true,
          message: 'A new confirmation code has been sent',
        };
        identityProviderServiceMock.resendConfirmationCode.mockResolvedValueOnce(
          successResponse,
        );
        const confirmPasswordDto: IResendConfirmationCodeDto = {
          username: '_test_admin@biggertech.co',
        };
        await request(app.getHttpServer())
          .post(url)
          .send(confirmPasswordDto)
          .expect(HttpStatus.OK)
          .then(({ body }) => {
            expect(body.data.attributes.success).toEqual(true);
          });
      });
      it("Should respond with an UserNotFoundException when the user doesn't exist", async () => {
        const username = 'fakeUsername';
        const error = new UsernameNotFoundException({
          username,
        });
        const forgotPasswordDto: IForgotPasswordDto = { username };
        await request(app.getHttpServer())
          .post(url)
          .send(forgotPasswordDto)
          .expect(HttpStatus.NOT_FOUND)
          .then(({ body }) => {
            expect(body.error.detail).toEqual(error.message);
          });
      });
      it('Should respond with an UnexpectedCodeError over unexpected errors', async () => {
        const error = new UnexpectedErrorCodeException({
          code: UNEXPECTED_ERROR_CODE_ERROR,
        });
        identityProviderServiceMock.resendConfirmationCode.mockRejectedValueOnce(
          error,
        );
        const confirmPasswordDto: IResendConfirmationCodeDto = {
          username: '_test_admin@biggertech.co',
        };
        return request(app.getHttpServer())
          .post(url)
          .send(confirmPasswordDto)
          .expect(HttpStatus.INTERNAL_SERVER_ERROR)
          .then(({ body }) => {
            expect(body.error.detail).toEqual(error.message);
          });
      });
    });
    describe('POST - /auth/refresh', () => {
      const url = '/api/v1/auth/refresh';
      it('Should refresh the session when provided a valid refresh token', async () => {
        const successProviderResponse: IRefreshSessionResponse = {
          accessToken: 'accessToken',
        };
        identityProviderServiceMock.refreshSession.mockResolvedValueOnce(
          successProviderResponse,
        );
        const refreshTokenDto: IRefreshSessionDto = {
          refreshToken: 'refreshToken',
          username: '_test_admin@biggertech.co',
        };
        const expectedResponse = expect.objectContaining({
          data: expect.objectContaining({
            attributes: expect.objectContaining({
              accessToken: 'accessToken',
            }),
          }),
        });
        await request(app.getHttpServer())
          .post(url)
          .send(refreshTokenDto)
          .expect(HttpStatus.OK)
          .then(({ body }) => {
            expect(body).toEqual(expectedResponse);
          });
      });
      it('Should respond with an InvalidRefreshTokenError when provided an invalid refresh token', async () => {
        const error = new InvalidRefreshTokenException({
          message: INVALID_REFRESH_TOKEN_ERROR,
        });
        identityProviderServiceMock.refreshSession.mockRejectedValueOnce(error);
        const refreshTokenDto: IRefreshSessionDto = {
          refreshToken: 'fakeRefreshToken',
          username: '_test_admin@biggertech.co',
        };
        await request(app.getHttpServer())
          .post(url)
          .send(refreshTokenDto)
          .expect(HttpStatus.UNAUTHORIZED)
          .then(({ body }) => {
            expect(body.error.detail).toEqual(error.message);
          });
      });
      it("Should respond with an UserNotFoundException when the user doesn't exist", async () => {
        const username = 'fakeUsername';
        const error = new UsernameNotFoundException({
          username,
        });
        const refreshTokenDto: IRefreshSessionDto = {
          refreshToken: 'fakeRefreshToken',
          username,
        };
        await request(app.getHttpServer())
          .post(url)
          .send(refreshTokenDto)
          .expect(HttpStatus.NOT_FOUND)
          .then(({ body }) => {
            expect(body.error.detail).toEqual(error.message);
          });
      });
      it('Should respond with an UnexpectedCodeError over unexpected errors', async () => {
        const error = new UnexpectedErrorCodeException({
          code: UNEXPECTED_ERROR_CODE_ERROR,
        });
        identityProviderServiceMock.refreshSession.mockRejectedValueOnce(error);
        const refreshSessionDto: IRefreshSessionDto = {
          username: '_test_admin@biggertech.co',
          refreshToken: 'refreshToken',
        };
        return request(app.getHttpServer())
          .post(url)
          .send(refreshSessionDto)
          .expect(HttpStatus.INTERNAL_SERVER_ERROR)
          .then(({ body }) => {
            expect(body.error.detail).toEqual(error.message);
          });
      });
    });
  });
});
