import { OneRelationResponseData } from '@common/base/application/dto/one-relation-response.interface.dto';
import { ILinks } from '@common/base/application/dto/serialized-response.interface';

export class OneRelationResponseDto {
  data: OneRelationResponseData;

  links: Omit<ILinks, 'last' | 'next'>;
}
