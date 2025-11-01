import { getDtoProperties } from '@common/base/application/dto/base.dto';
import { FieldsQueryParamsDto } from '@common/base/application/dto/query-param/fields-query-params.dto';
import { FieldOptions } from '@common/base/get-all-options.interface';

import { StoreDto } from '../dto/store.dto';

export class StoreFieldsQueryParamsDto extends FieldsQueryParamsDto<StoreDto> {
  target = getDtoProperties(StoreDto) as FieldOptions<StoreDto>;
}
