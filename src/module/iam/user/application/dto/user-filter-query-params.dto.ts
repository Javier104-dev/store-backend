import { UserDto } from '@module/iam/user/application/dto/user.dto';

import { FilterOptions } from '@common/base/get-all-options.interface';

export class UserFilterQueryParamsDto
  extends UserDto
  implements FilterOptions<UserDto> {}
