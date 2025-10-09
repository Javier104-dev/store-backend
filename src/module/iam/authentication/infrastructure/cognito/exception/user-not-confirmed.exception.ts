import { ForbiddenException } from '@nestjs/common';

import { IBaseErrorInfoParams } from '@common/base/application/exception/base-error.interface';

export class UserNotConfirmedException extends ForbiddenException {
  constructor(params: IBaseErrorInfoParams) {
    super(params);
  }
}
