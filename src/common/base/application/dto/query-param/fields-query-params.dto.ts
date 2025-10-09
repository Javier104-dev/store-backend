import { Transform } from 'class-transformer';
import { IsString } from 'class-validator';

import { DtoMapper } from '@common/base/application/mapper/dto.mapper';
import { FieldOptions } from '@common/base/get-all-options.interface';

export class FieldsQueryParamsDto<T> {
  @Transform(({ value }) => DtoMapper.fromCommaSeparatedToArray(value))
  @IsString({ each: true })
  target?: FieldOptions<T>;
}
