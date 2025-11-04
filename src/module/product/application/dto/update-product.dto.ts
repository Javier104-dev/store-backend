import { ProductDto } from '@module/product/application/dto/product.dto';
import { PartialType } from '@nestjs/swagger';

export class UpdateProductDto extends PartialType(ProductDto) {}
