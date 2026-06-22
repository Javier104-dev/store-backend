import { CartDto } from '@module/cart/application/dto/cart.dto';
import { PartialType } from '@nestjs/swagger';

export class UpdateCartDto extends PartialType(CartDto) {}
