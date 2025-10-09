import { UnauthorizedException } from '@nestjs/common';

import { IBaseErrorInfoParams } from '@common/base/application/exception/base-error.interface';

export class InvalidPasswordException extends UnauthorizedException {
  constructor(params: IBaseErrorInfoParams) {
    super(params);
  }
}
