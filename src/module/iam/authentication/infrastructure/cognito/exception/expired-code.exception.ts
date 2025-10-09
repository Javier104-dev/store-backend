import { BadRequestException } from '@nestjs/common';

import { IBaseErrorInfoParams } from '@common/base/application/exception/base-error.interface';

export class ExpiredCodeException extends BadRequestException {
  constructor(params: IBaseErrorInfoParams) {
    const pointer = params.pointer ?? '/confirm-password/code';
    super({
      ...params,
      pointer,
    });
  }
}
