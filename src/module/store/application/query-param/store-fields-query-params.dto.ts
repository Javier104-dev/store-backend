import { StoreDto } from '@module/store/application/dto/store.dto';

import { getDtoProperties } from '@common/base/application/dto/base.dto';
import { FieldsQueryParamsDto } from '@common/base/application/dto/query-param/fields-query-params.dto';
import { FieldOptions } from '@common/base/get-all-options.interface';

export class StoreFieldsQueryParamsDto extends FieldsQueryParamsDto<StoreDto> {
  target = getDtoProperties(StoreDto) as FieldOptions<StoreDto>;
}
