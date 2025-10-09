import { AuthenticationService } from '@module/iam/authentication/application/service/authentication.service';
import { AppRole } from '@module/iam/authorization/domain/app-role.enum';
import { UserService } from '@module/iam/user/application/service/user.service';
import {
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { Session } from 'express-session';

export interface RequestWithSession extends Omit<Request, 'session'> {
  session: Session & {
    destroy(callback: (err?: Error) => void): void;
  };
}

export class AuthenticationProvider {
  constructor(
    private readonly authenticationService: AuthenticationService,
    private readonly userService: UserService,
  ) {}

  public getUiProps(): Record<string, unknown> {
    return {};
  }

  async authenticate(email: string, password: string) {
    try {
      const userTokens = await this.authenticationService.handleSignIn({
        username: email,
        password,
      });

      if (!userTokens) {
        throw new UnauthorizedException('Invalid credentials');
      }

      const user = await this.userService.getOneByUsername(email);

      if (!user) {
        throw new NotFoundException("User doesn't exist");
      }

      if (
        !user.roles.includes(AppRole.Admin) &&
        !user.roles.includes(AppRole.SuperAdmin)
      ) {
        throw new UnauthorizedException('Insufficient permissions');
      }

      return {
        ...user,
        token: userTokens.data.attributes.accessToken,
      };
    } catch (error) {
      Logger.error('Authentication error: ', error);
      throw error;
    }
  }

  async handleLogin(
    request: RequestWithSession & { data: { email: string; password: string } },
  ) {
    return this.authenticate(request.data.email, request.data.password);
  }

  async handleLogout(request: RequestWithSession): Promise<boolean> {
    if (request.session) {
      return new Promise((resolve) => {
        request.session.destroy((err) => {
          if (err) {
            resolve(false);
          }
          resolve(true);
        });
      });
    }
    return true;
  }
}
