import { UserDto } from '@module/iam/user/application/dto/user.dto';

import { getDtoProperties } from '@common/base/application/dto/base.dto';
import { FieldsQueryParamsDto } from '@common/base/application/dto/query-param/fields-query-params.dto';
import { FieldOptions } from '@common/base/get-all-options.interface';

export class UserFieldsQueryParamsDto extends FieldsQueryParamsDto<UserDto> {
  target = getDtoProperties(UserDto) as FieldOptions<UserDto>;
}
