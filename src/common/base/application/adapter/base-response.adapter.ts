import { Injectable } from '@nestjs/common';

import { CollectionDto } from '@common/base/application/dto/collection.dto';
import { IDto } from '@common/base/application/dto/dto.interface';
import { ManySerializedResponseDto } from '@common/base/application/dto/many-serialized-response.dto';
import { OneRelationResponse } from '@common/base/application/dto/one-relation-response.interface.dto';

import { ResponseSerializerService } from '@/module/app/application/service/response-serializer.service';

@Injectable()
export class BaseResponseAdapter {
  constructor(private readonly serializerService: ResponseSerializerService) {}

  public oneEntityResponse<ResponseDto extends object>(
    entityName: string,
    resource: ResponseDto,
    relationshipsKeys: string[] = [],
  ) {
    const options = this.serializerService.createSerializationOptions(
      resource as Record<string, unknown>,
      relationshipsKeys,
    );

    const serializedResource = this.serializerService.serialize(
      entityName,
      { id: '', ...resource } as Record<string, unknown>,
      options,
    );
    this.serializerService.addSelfLink(serializedResource);
    if (!relationshipsKeys.length) return serializedResource;

    const { relationships } = this.serializerService.getRelationshipsFromArray(
      resource as Record<string, unknown>,
      relationshipsKeys,
      entityName,
      false,
    );

    const { included } = this.serializerService.getIncludedData(
      resource as Record<string, unknown>,
      relationshipsKeys,
      entityName,
    );

    return {
      ...serializedResource,
      included,
      data: {
        ...serializedResource.data,
        relationships,
      },
    };
  }

  public manyEntitiesResponse<ResponseDto extends IDto>(
    entityName: string,
    collection: CollectionDto<ResponseDto>,
    relationshipKeys: string[] = [],
  ): ManySerializedResponseDto<ResponseDto> {
    const { data, ...paginationData } = collection;

    if (data.length === 0) {
      const { links } = this.serializerService.getManyEntitiesLinks(collection);
      return {
        data: [],
        meta: paginationData,
        links: {
          ...links,
          related: null,
        },
        included: [],
      };
    }

    const resource = data[0];
    const options = this.serializerService.createSerializationOptions(
      resource as Record<string, unknown>,
      relationshipKeys,
    );

    const serializedResources = this.serializerService.serialize(
      entityName,
      data as Record<string, unknown>[],
      options,
    );

    for (let i = 0; i < data.length; i++) {
      if (!relationshipKeys.length) break;
      const currentResource = data[i];
      const currentSerializedResource = serializedResources.data[i];
      const { relationships } =
        this.serializerService.getRelationshipsFromArray(
          currentResource as Record<string, unknown>,
          relationshipKeys,
          entityName,
          true,
        );

      serializedResources.data[i] = {
        ...currentSerializedResource,
        relationships,
      };
    }
    const includedResourcesList = [];
    for (const currentResource of data) {
      if (!relationshipKeys.length) break;

      const { included: includedResources } =
        this.serializerService.getIncludedData(
          currentResource as Record<string, unknown>,
          relationshipKeys,
          entityName,
        );

      includedResourcesList.push(...includedResources);
    }

    const links = this.serializerService.getManyEntitiesLinks(collection);
    const includedWithoutDuplicates = includedResourcesList.reduce(
      (acc, item) => {
        const { id, type } = item;
        const isAlreadyAdded = acc.find(
          (resource) => resource.id === id && resource.type === type,
        );
        if (!isAlreadyAdded) acc.push(item);
        return acc;
      },
      [],
    );

    return {
      ...serializedResources,
      ...links,
      meta: paginationData,
      included: includedWithoutDuplicates,
    };
  }

  public oneRelationshipsResponse<
    ResponseDto extends object,
    Relation extends string,
  >(
    response: ResponseDto | ResponseDto[],
    relationName: Relation,
    id: string | undefined,
  ): OneRelationResponse {
    const isNotArray = !Array.isArray(response);

    const serializedResponse = isNotArray
      ? this.serializerService.serialize(
          relationName,
          response as Record<string, unknown>,
        )
      : response.map((item) =>
          this.serializerService.serialize(
            relationName,
            item as Record<string, unknown>,
          ),
        );

    const serializedData = isNotArray
      ? [serializedResponse.data]
      : serializedResponse.map(({ data }) => data);

    const links = this.serializerService.getLinkForOneRelationship(
      relationName,
      id,
    );

    return {
      data: serializedData,
      links,
    };
  }
}
