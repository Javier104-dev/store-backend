import { AuthenticationService } from '@module/iam/authentication/application/service/authentication.service';
import { AuthenticationProvider } from '@module/iam/authentication/infrastructure/admin/admin-authentication.provider';
import { RequestWithSession } from '@module/iam/authentication/infrastructure/admin/admin-authentication.provider';
import { AppRole } from '@module/iam/authorization/domain/app-role.enum';
import { UserService } from '@module/iam/user/application/service/user.service';
import { User } from '@module/iam/user/domain/user.entity';
import { NotFoundException, UnauthorizedException } from '@nestjs/common';
import { Session } from 'express-session';

describe('AuthenticationProvider', () => {
  let authenticationProvider: AuthenticationProvider;
  let authenticationService: AuthenticationService;
  let userService: UserService;

  const mockUser = {
    id: '00000000-0000-0000-0000-000000000000',
    email: 'test@example.com',
    username: 'test@example.com',
    isVerified: true,
    roles: [AppRole.Admin],
  } as User;

  const mockTokens = {
    data: {
      attributes: {
        accessToken: 'test-access-token',
        refreshToken: 'test-refresh-token',
      },
    },
  };

  beforeEach(() => {
    authenticationService = {
      handleSignIn: jest.fn().mockResolvedValue(mockTokens),
    } as unknown as AuthenticationService;

    userService = {
      getOneByUsername: jest.fn().mockResolvedValue(mockUser),
    } as unknown as UserService;

    authenticationProvider = new AuthenticationProvider(
      authenticationService,
      userService,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getUiProps', () => {
    it('should return an empty object', () => {
      expect(authenticationProvider.getUiProps()).toEqual({});
    });
  });

  describe('authenticate', () => {
    it('should authenticate admin user successfully', async () => {
      const result = await authenticationProvider.authenticate(
        'test@example.com',
        'password',
      );

      expect(result).toEqual({
        ...mockUser,
        token: mockTokens.data.attributes.accessToken,
      });
    });

    it('should throw UnauthorizedException when credentials are invalid', async () => {
      jest.spyOn(authenticationService, 'handleSignIn').mockResolvedValue(null);

      await expect(
        authenticationProvider.authenticate(
          'test@example.com',
          'wrong-password',
        ),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should throw NotFoundException when user does not exist', async () => {
      jest.spyOn(userService, 'getOneByUsername').mockResolvedValue(null);

      await expect(
        authenticationProvider.authenticate(
          'nonexistent@example.com',
          'password',
        ),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw UnauthorizedException when user is not an admin', async () => {
      const regularUser = { ...mockUser, roles: [], id: mockUser.id };
      jest
        .spyOn(userService, 'getOneByUsername')
        .mockResolvedValue(regularUser);

      await expect(
        authenticationProvider.authenticate('test@example.com', 'password'),
      ).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('handleLogin', () => {
    it('should call authenticate with correct credentials', async () => {
      const mockRequest = {
        data: { email: 'test@example.com', password: 'password' },
        session: {} as Session,
        ...({} as RequestWithSession),
      };

      const spy = jest.spyOn(authenticationProvider, 'authenticate');
      await authenticationProvider.handleLogin(mockRequest);
      expect(spy).toHaveBeenCalledWith('test@example.com', 'password');
    });
  });

  describe('handleLogout', () => {
    it('should destroy session and return true', async () => {
      const mockSession = {
        destroy: jest.fn((cb) => cb()),
      };

      const mockRequest = {
        session: mockSession,
        ...({} as RequestWithSession),
      };

      const result = await authenticationProvider.handleLogout(mockRequest);
      expect(result).toBe(true);
    });

    it('should return false when session destruction fails', async () => {
      const mockSession = {
        destroy: jest.fn((cb) => cb(new Error())),
      };

      const mockRequest = {
        session: mockSession,
        ...({} as RequestWithSession),
      };

      const result = await authenticationProvider.handleLogout(mockRequest);
      expect(result).toBe(false);
    });
  });
});
