import { NotFoundException } from '@nestjs/common';

import { IBaseErrorInfoParams } from '@common/base/application/exception/base-error.interface';

export class StoreNotFoundException extends NotFoundException {
  constructor(params: IBaseErrorInfoParams) {
    super(params);
  }
}
