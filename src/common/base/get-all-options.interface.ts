import { FindOptionsOrder, FindOptionsWhere } from 'typeorm';

import { IDto } from '@common/base/application/dto/dto.interface';
import { SortType } from '@common/base/application/enum/sort-type.enum';
import { Base } from '@common/base/domain/base.entity';
import IEntity from '@common/base/domain/entity.interface';

export type OnlyAttributes<Entity> = {
  [P in keyof Entity]: Entity[P] extends
    | Base[]
    | Base
    | ((...args: unknown[]) => unknown)
    ? never
    : P;
}[keyof Entity];

export type PageOptions = {
  number?: number;
  size?: number;
  offset?: number;
};

export type FilterOptions<Entity> = Partial<{
  [P in OnlyAttributes<Entity>]?: Entity[P];
}>;

export type SortOptions<Entity> = Partial<{
  [P in OnlyAttributes<Entity>]: SortType;
}>;

export type FieldOptions<Entity> = OnlyAttributes<Entity>[];

export interface IGetAllOptions<Entity extends IDto | IEntity, Relations = []> {
  page?: PageOptions;
  filter?: FilterOptions<Entity>;
  sort?: SortOptions<Entity>;
  fields?: FieldOptions<Entity>;
  include?: Relations;
}

export interface IGetOneOptions<Entity> {
  filter?: FindOptionsWhere<Entity>;
  relations?: string[];
  order?: FindOptionsOrder<Entity>;
}
