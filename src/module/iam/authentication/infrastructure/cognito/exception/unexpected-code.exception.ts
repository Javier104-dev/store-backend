import { UNEXPECTED_ERROR_CODE_ERROR } from '@module/iam/authentication/infrastructure/cognito/exception/cognito-exception-messages';
import { InternalServerErrorException } from '@nestjs/common';

import { IBaseErrorInfoParams } from '@common/base/application/exception/base-error.interface';

type Params = Omit<IBaseErrorInfoParams, 'message'> & { code: string };

export class UnexpectedErrorCodeException extends InternalServerErrorException {
  constructor(params: Params) {
    super({
      ...params,
      message: `${UNEXPECTED_ERROR_CODE_ERROR} - ${params.code}`,
    });
  }
}
