import { Injectable } from '@nestjs/common';

import { CollectionDto } from '@common/base/application/dto/collection.dto';
import { IDto } from '@common/base/application/dto/dto.interface';
import { ManySerializedResponseDto } from '@common/base/application/dto/many-serialized-response.dto';
import { OneRelationResponse } from '@common/base/application/dto/one-relation-response.interface.dto';
import { RelationshipTree } from '@common/base/types/relationship-tree.type';

import { ResponseSerializerService } from '@/module/app/application/service/response-serializer.service';

@Injectable()
export class BaseResponseAdapter {
  constructor(private readonly serializerService: ResponseSerializerService) {}

  public oneEntityResponse<ResponseDto extends object>(
    entityName: string,
    resource: ResponseDto,
    relationships: RelationshipTree = {},
    transformIncluded?: Record<string, (rel: unknown) => unknown>,
  ) {
    const flatKeys = Object.keys(relationships);

    const options = this.serializerService.createSerializationOptions(
      resource as Record<string, unknown>,
      flatKeys,
    );

    const serializedResource = this.serializerService.serialize(
      entityName,
      { id: '', ...resource } as Record<string, unknown>,
      options,
    );

    this.serializerService.addSelfLink(serializedResource);

    if (!flatKeys.length) return serializedResource;

    const { relationships: rels } =
      this.serializerService.getRelationshipsFromArray(
        resource as Record<string, unknown>,
        flatKeys,
        entityName,
        false,
      );

    const allIncluded = this.processIncluded(
      resource as Record<string, unknown>,
      relationships,
      entityName,
      transformIncluded,
    );

    const included = allIncluded.filter(
      (item, index, self) =>
        index ===
        self.findIndex((r) => {
          const a = r as { id: string; type: string };
          const b = item as { id: string; type: string };
          return a.id === b.id && a.type === b.type;
        }),
    );

    return {
      ...serializedResource,
      included,
      data: {
        ...serializedResource.data,
        relationships: rels,
      },
    };
  }

  manyEntitiesResponse<ResponseDto extends IDto>(
    entityName: string,
    collection: CollectionDto<ResponseDto>,
    relationships: RelationshipTree = {},
    transformIncluded?: Record<string, (rel: unknown) => unknown>,
  ): ManySerializedResponseDto<ResponseDto> {
    const { data, ...paginationData } = collection;
    const flatKeys = Object.keys(relationships);

    if (data.length === 0) {
      const { links } = this.serializerService.getManyEntitiesLinks(collection);
      return {
        data: [],
        meta: paginationData,
        links: { ...links, related: null },
        included: [],
      };
    }

    const options = this.serializerService.createSerializationOptions(
      data[0] as Record<string, unknown>,
      flatKeys,
    );

    const serializedResources = this.serializerService.serialize(
      entityName,
      data as Record<string, unknown>[],
      options,
    );

    for (let i = 0; i < data.length; i++) {
      if (!flatKeys.length) break;

      const { relationships: rels } =
        this.serializerService.getRelationshipsFromArray(
          data[i] as Record<string, unknown>,
          flatKeys,
          entityName,
          true,
        );

      serializedResources.data[i] = {
        ...serializedResources.data[i],
        relationships: rels,
      };
    }

    const allIncluded = flatKeys.length
      ? data.flatMap((currentResource) =>
          this.processIncluded(
            currentResource as Record<string, unknown>,
            relationships,
            entityName,
            transformIncluded,
          ),
        )
      : [];

    const included = allIncluded.filter((item, index, self) => {
      const current = item as { id: string; type: string };
      return (
        index ===
        self.findIndex((r) => {
          const other = r as { id: string; type: string };
          return other.id === current.id && other.type === current.type;
        })
      );
    });

    return {
      ...serializedResources,
      ...this.serializerService.getManyEntitiesLinks(collection),
      meta: paginationData,
      included,
    };
  }

  private processIncluded(
    resource: Record<string, unknown>,
    relationships: RelationshipTree,
    entityName: string,
    transformIncluded?: Record<string, (rel: unknown) => unknown>,
  ): unknown[] {
    const flatKeys = Object.keys(relationships);

    const { included: includedResources } =
      this.serializerService.getIncludedData(
        resource,
        flatKeys,
        entityName,
        transformIncluded,
      );

    const nested = [];

    const processed = includedResources.map((includedResource) => {
      const relDef = relationships[includedResource.type as string];

      if (!relDef || relDef === true) return includedResource;

      const originalEntity = this.findOriginalEntity(
        resource,
        flatKeys,
        includedResource.id as string,
      );

      if (!originalEntity) return includedResource;

      const nestedFlatKeys = Object.keys(relDef);

      const { relationships: nestedRelationships } =
        this.serializerService.getRelationshipsFromArray(
          originalEntity,
          nestedFlatKeys,
          includedResource.type as string,
          true,
        );

      const { included: nestedIncluded } =
        this.serializerService.getIncludedData(
          originalEntity,
          nestedFlatKeys,
          includedResource.type as string,
          transformIncluded,
        );

      nested.push(...nestedIncluded);

      const cleanAttributes = {
        ...(includedResource.attributes as Record<string, unknown>),
      };
      nestedFlatKeys.forEach((key) => delete cleanAttributes[key]);

      return {
        ...includedResource,
        attributes: cleanAttributes,
        relationships: nestedRelationships,
      };
    });

    return [...processed, ...nested];
  }

  private findOriginalEntity(
    parentResource: Record<string, unknown>,
    relationshipKeys: string[],
    targetId: string,
  ): Record<string, unknown> | null {
    for (const key of relationshipKeys) {
      const related = parentResource[key];
      if (!related) continue;
      const found = (Array.isArray(related) ? related : [related]).find(
        (r: Record<string, unknown>) => r['id'] === targetId,
      );
      if (found) return found as Record<string, unknown>;
    }
    return null;
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
