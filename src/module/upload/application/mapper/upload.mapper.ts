import { Upload } from '@module/upload/domain/upload.entity';

import { IDto } from '@common/base/application/dto/dto.interface';
import { DtoMapper } from '@common/base/application/mapper/dto.mapper';
import { MapperOption } from '@common/base/application/mapper/mapper.option';

export class UploadMapper extends DtoMapper {
  fromEntity<T extends IDto>(
    entity: Upload,
    mapperOptions?: { include?: string[]; exclude?: string[] },
  ): T {
    return super.fromEntity(entity, new MapperOption(mapperOptions));
  }
}
