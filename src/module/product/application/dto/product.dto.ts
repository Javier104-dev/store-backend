import { Category } from '@module/category/domain/category.entity';
import { Store } from '@module/store/domain/store.entity';
import { IsArray, IsOptional } from 'class-validator';

import { BaseDto, DtoProperty } from '@common/base/application/dto/base.dto';

export class ProductDto extends BaseDto {
  @DtoProperty
  @IsOptional()
  name?: string;

  @DtoProperty
  @IsOptional()
  price?: number;

  @DtoProperty
  @IsOptional()
  description: string;
}
