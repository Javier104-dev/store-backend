import { BaseResponseAdapter } from '@common/base/application/adapter/base-response.adapter';
import { DtoMapper } from '@common/base/application/mapper/dto.mapper';
import { IUseCase } from '@common/base/application/use-case/use-case.interface';
import IEntity from '@common/base/domain/entity.interface';
import IRepository from '@common/base/infrastructure/database/repository.interface';

abstract class BaseUseCase<T extends IEntity> implements IUseCase {
  constructor(
    protected readonly repository: IRepository<T>,
    protected readonly mapper: DtoMapper,
    protected readonly responseAdapter: BaseResponseAdapter,
    protected readonly entityName: string,
  ) {}
}

export default BaseUseCase;
