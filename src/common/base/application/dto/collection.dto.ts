import { ICollection } from '@common/base/application/dto/collection.interface';

export class CollectionDto<Data extends object> implements ICollection<Data> {
  readonly data: Data[];

  readonly pageNumber: number;

  readonly pageSize: number;

  readonly pageCount: number;

  readonly itemCount: number;

  constructor({
    data,
    pageNumber,
    pageSize,
    pageCount,
    itemCount,
  }: ICollection<Data>) {
    this.data = data;
    this.pageNumber = pageNumber;
    this.pageSize = pageSize;
    this.pageCount = pageCount;
    this.itemCount = itemCount;
  }
}
