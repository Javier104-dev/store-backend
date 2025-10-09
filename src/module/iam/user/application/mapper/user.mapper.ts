import { User } from '@module/iam/user/domain/user.entity';

import { IDto } from '@common/base/application/dto/dto.interface';
import { DtoMapper } from '@common/base/application/mapper/dto.mapper';
import { MapperOption } from '@common/base/application/mapper/mapper.option';

export class UserMapper extends DtoMapper {
  fromEntity<T extends IDto>(entity: User): T {
    return super.fromEntity(
      entity,
      new MapperOption({
        exclude: [],
      }),
    );
  }
}
