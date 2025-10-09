import { USERNAME_NOT_FOUND_ERROR } from '@module/iam/user/infrastructure/database/exception/user-exception-messages';
import { NotFoundException } from '@nestjs/common';

import { IBaseErrorInfoParams } from '@common/base/application/exception/base-error.interface';

type Params = Omit<IBaseErrorInfoParams, 'message'> & { username: string };

export class UsernameNotFoundException extends NotFoundException {
  constructor(params: Params) {
    const message = `${params.username} ${USERNAME_NOT_FOUND_ERROR}`;
    super({ ...params, message });
  }
}
