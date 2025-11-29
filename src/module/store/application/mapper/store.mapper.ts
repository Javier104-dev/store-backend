import { Store } from '@module/store/domain/store.entity';

import { IDto } from '@common/base/application/dto/dto.interface';
import { DtoMapper } from '@common/base/application/mapper/dto.mapper';
import { MapperOption } from '@common/base/application/mapper/mapper.option';

export class StoreMapper extends DtoMapper {
  fromEntity<T extends IDto>(
    entity: Store,
    mapperOptions?: { include?: string[]; exclude?: string[] },
  ): T {
    return super.fromEntity(entity, new MapperOption(mapperOptions));
  }
}
