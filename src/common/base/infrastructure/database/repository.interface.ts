import { ICollection } from '@common/base/application/dto/collection.interface';
import IEntity from '@common/base/domain/entity.interface';
import { IGetAllOptions } from '@common/base/get-all-options.interface';

interface IRepository<T extends IEntity> {
  getAll(options: IGetAllOptions<T>): Promise<ICollection<T>>;

  getOneByIdOrFail(id: string): Promise<T>;

  getOneById(id: string): Promise<T>;

  saveOne(entity: T): Promise<T>;

  saveMany(entities: T[]): Promise<T[]>;

  updateOneOrFail(id: string, updates: Partial<Omit<T, 'id'>>): Promise<T>;

  deleteOneOrFail(id: string): Promise<void>;

  deleteMany(id: string[]): Promise<void>;

  deleteOne(id: string): Promise<void>;
}

export default IRepository;
