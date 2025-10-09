import { BadRequestException } from '@nestjs/common';

import { IBaseErrorInfo } from '@common/base/application/exception/base-error.interface';

export class PasswordValidationException extends BadRequestException {
  constructor(params: IBaseErrorInfo) {
    super(params);
  }
}
