import { ProductDto } from '@module/product/application/dto/product.dto';
import { IsArray, IsOptional, IsUUID } from 'class-validator';

import { DtoProperty } from '@common/base/application/dto/base.dto';

export class CreateProductDto extends ProductDto {
  @DtoProperty
  @IsOptional()
  @IsArray()
  @IsUUID('all', { each: true })
  categoryIds?: string[];
}
