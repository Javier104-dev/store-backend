import { CartItem } from '@module/cart/domain/cart-item.entity';

import { IDto } from '@common/base/application/dto/dto.interface';
import { DtoMapper } from '@common/base/application/mapper/dto.mapper';
import { MapperOption } from '@common/base/application/mapper/mapper.option';

export class CartItemMapper extends DtoMapper {
  fromEntity<T extends IDto>(
    entity: CartItem,
    mapperOptions?: { include?: string[]; exclude?: string[] },
  ): T {
    return super.fromEntity(entity, new MapperOption(mapperOptions));
  }
}
