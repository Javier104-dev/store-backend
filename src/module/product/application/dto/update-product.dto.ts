import { CreateProductDto } from '@module/product/application/dto/create-product.dto';
import { PartialType } from '@nestjs/swagger';
import { IsArray, IsOptional, IsUUID } from 'class-validator';

import { DtoProperty } from '@common/base/application/dto/base.dto';

export class UpdateProductDto extends PartialType(CreateProductDto) {
  @DtoProperty
  @IsOptional()
  @IsArray()
  @IsUUID('all', { each: true })
  uploadIds?: string[];
}
