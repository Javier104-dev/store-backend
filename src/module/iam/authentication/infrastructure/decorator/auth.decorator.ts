import { AuthType } from '@module/iam/authentication/domain/auth-type.enum';
import { SetMetadata } from '@nestjs/common';

export const AUTH_TYPE_KEY = 'auth_type';

export const Auth = (...authTypes: AuthType[]) =>
  SetMetadata(AUTH_TYPE_KEY, authTypes);
