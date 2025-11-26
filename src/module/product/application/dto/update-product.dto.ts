import { CreateProductDto } from '@module/product/application/dto/create-product.dto';
import { PartialType } from '@nestjs/swagger';

export class UpdateProductDto extends PartialType(CreateProductDto) {}
