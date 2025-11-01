import { BaseDto, DtoProperty } from "@common/base/application/dto/base.dto";
import { IsOptional } from "class-validator";

export class StoreDto extends BaseDto {
  @DtoProperty
  @IsOptional()
  name?: string;

  @DtoProperty
  @IsOptional()
  ownerId?: string;
}