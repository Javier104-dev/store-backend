import { IAccessTokenPayload } from '@module/iam/authentication/infrastructure/passport/access-token-payload.interface';
import * as jwt from 'jsonwebtoken';

import { JWT_AUTOMATED_TESTS_SECRET } from '@test/test.constants';

export const createAccessToken = (
  payload: Partial<IAccessTokenPayload>,
  options?: jwt.SignOptions,
) => {
  return jwt.sign(payload, JWT_AUTOMATED_TESTS_SECRET, options);
};
