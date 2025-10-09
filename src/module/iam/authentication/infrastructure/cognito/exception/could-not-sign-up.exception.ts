import { InternalServerErrorException } from '@nestjs/common';

import { IBaseErrorInfoParams } from '@common/base/application/exception/base-error.interface';

export class CouldNotSignUpException extends InternalServerErrorException {
  constructor(params: IBaseErrorInfoParams) {
    super(params);
  }
}
