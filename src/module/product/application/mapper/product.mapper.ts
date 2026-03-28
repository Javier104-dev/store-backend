import { Product } from '@module/product/domain/product.entity';

import { IDto } from '@common/base/application/dto/dto.interface';
import { DtoMapper } from '@common/base/application/mapper/dto.mapper';
import { MapperOption } from '@common/base/application/mapper/mapper.option';

export class ProductMapper extends DtoMapper {
  fromEntity<T extends IDto>(
    entity: Product,
    mapperOptions?: { include?: string[]; exclude?: string[] },
  ): T {
    return super.fromEntity(entity, new MapperOption(mapperOptions));
  }
}
