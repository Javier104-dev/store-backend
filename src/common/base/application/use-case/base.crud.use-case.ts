import { CollectionDto } from '@common/base/application/dto/collection.dto';
import { IDto } from '@common/base/application/dto/dto.interface';
import { ManySerializedResponseDto } from '@common/base/application/dto/many-serialized-response.dto';
import { OneSerializedResponseDto } from '@common/base/application/dto/one-serialized-response.dto';
import BaseUseCase from '@common/base/application/use-case/base.use-case';
import IEntity from '@common/base/domain/entity.interface';
import { IGetAllOptions } from '@common/base/get-all-options.interface';

abstract class BaseCrudUseCase<
  Entity extends IEntity,
  ResponseDto extends IDto,
  CreateDto extends IDto,
  UpdateDto extends IDto,
> extends BaseUseCase<Entity> {
  async getAll(
    options?: IGetAllOptions<Entity>,
  ): Promise<ManySerializedResponseDto<ResponseDto>> {
    const collection = await this.repository.getAll(options);
    const collectionDto = new CollectionDto({
      ...collection,
      data: collection.data.map((entity) =>
        this.mapper.fromEntity<ResponseDto>(entity),
      ),
    });

    return this.responseAdapter.manyEntitiesResponse(
      this.entityName,
      collectionDto,
    );
  }

  async getOneByIdOrFail(
    id: string,
  ): Promise<OneSerializedResponseDto<ResponseDto>> {
    const entity = await this.repository.getOneByIdOrFail(id);
    return this.responseAdapter.oneEntityResponse(
      this.entityName,
      this.mapper.fromEntity<ResponseDto>(entity),
    );
  }

  async saveOne(
    dto: CreateDto,
  ): Promise<OneSerializedResponseDto<ResponseDto>> {
    const entity = await this.repository.saveOne(
      this.mapper.toEntity<Entity>(dto),
    );
    return this.responseAdapter.oneEntityResponse<ResponseDto>(
      this.entityName,
      this.mapper.fromEntity<ResponseDto>(entity),
    );
  }

  async updateOneOrFail(
    id: string,
    dto: UpdateDto,
  ): Promise<OneSerializedResponseDto<ResponseDto>> {
    const entity = await this.repository.updateOneOrFail(
      id,
      this.mapper.toEntity<Entity>(dto),
    );
    return this.responseAdapter.oneEntityResponse<ResponseDto>(
      this.entityName,
      this.mapper.fromEntity<ResponseDto>(entity),
    );
  }

  async deleteOneOrFail(id: string): Promise<void> {
    return this.repository.deleteOneOrFail(id);
  }

  async saveOneRaw(dto: CreateDto): Promise<Entity> {
    return this.repository.saveOne(this.mapper.toEntity<Entity>(dto));
  }

  async updateOneOrFailRaw(id: string, dto: UpdateDto): Promise<Entity> {
    return this.repository.updateOneOrFail(
      id,
      this.mapper.toEntity<Entity>(dto),
    );
  }
}

export default BaseCrudUseCase;
