import {
  IBaseSerializedResponseDto,
  IDataWithSelfLink,
  ILinks,
  ISerializedData,
} from '@common/base/application/dto/serialized-response.interface';

export class OneSerializedResponseDto<
  ResponseDto extends object,
> implements IBaseSerializedResponseDto {
  readonly data: ISerializedData<ResponseDto>;

  readonly included?: IDataWithSelfLink<unknown>[];

  readonly links: Omit<ILinks, 'last' | 'next'>;

  constructor({
    data,
    included,
    links,
  }: {
    data: ISerializedData<ResponseDto>;
    included?: IDataWithSelfLink<unknown>[];
    links: Omit<ILinks, 'last' | 'next'>;
  }) {
    this.data = data;
    this.included = included;
    this.links = links;
  }
}
