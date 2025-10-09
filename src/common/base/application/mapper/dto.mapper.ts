import { instanceToInstance, instanceToPlain } from 'class-transformer';

import { IDto } from '@common/base/application/dto/dto.interface';
import { MapperOption } from '@common/base/application/mapper/mapper.option';
import IEntity from '@common/base/domain/entity.interface';

export class DtoMapper {
  static fromCommaSeparatedToArray(value: string): string[] {
    return value.replace(/\s/g, '').split(',');
  }

  fromEntity<T extends IDto>(entity: IEntity, mapperOption?: MapperOption): T {
    const clone = instanceToInstance(entity);

    if (mapperOption) {
      if (mapperOption.transforms.length) {
        mapperOption.transforms.forEach((transform) => {
          clone[transform.fieldName] = transform.transformer(
            clone[transform.fieldName],
          );
        });
      }
      if (mapperOption.exclude.length) {
        mapperOption.exclude.forEach((field) => {
          delete clone[field];
        });

        return instanceToPlain(clone) as T;
      }

      if (mapperOption.include.length) {
        const clone = {};
        mapperOption.include.forEach((field) => {
          clone[field] = entity[field];
        });
        return clone as T;
      }
    }

    return instanceToPlain(clone) as T;
  }

  toEntity<T extends IEntity>(dto: IDto): T {
    return instanceToPlain(dto) as T;
  }
}
