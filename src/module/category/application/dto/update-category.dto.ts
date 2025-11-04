import { CategoryDto } from '@module/category/application/dto/category.dto';
import { PartialType } from '@nestjs/swagger';

export class UpdateCategoryDto extends PartialType(CategoryDto) {}
