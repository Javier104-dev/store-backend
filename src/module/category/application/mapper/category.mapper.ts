import { Category } from '@module/category/domain/category.entity';

import { IDto } from '@common/base/application/dto/dto.interface';
import { DtoMapper } from '@common/base/application/mapper/dto.mapper';

export class CategoryMapper extends DtoMapper {
  fromEntity<T extends IDto>(entity: Category): T {
    return super.fromEntity(entity);
  }
}
