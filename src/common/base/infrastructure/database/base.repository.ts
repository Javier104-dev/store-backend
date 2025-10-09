import { Injectable } from '@nestjs/common';
import { DeepPartial, FindOptionsWhere, Repository } from 'typeorm';

import { ICollection } from '@common/base/application/dto/collection.interface';
import IEntity from '@common/base/domain/entity.interface';
import { IGetAllOptions } from '@common/base/get-all-options.interface';
import EntityNotFoundException from '@common/base/infrastructure/database/exception/not-found.exception';
import IRepository from '@common/base/infrastructure/database/repository.interface';

import { isEmptyObject } from './utils/object.utils';

@Injectable()
class BaseRepository<T extends IEntity> implements IRepository<T> {
  protected readonly repository: Repository<T>;

  constructor(repository: Repository<T>) {
    this.repository = repository;
  }

  async deleteOneOrFail(id: string): Promise<void> {
    const entityToDelete = await this.repository.findOne({
      where: { id } as FindOptionsWhere<T>,
    });

    if (!entityToDelete || isEmptyObject(entityToDelete)) {
      throw new EntityNotFoundException(id);
    }

    await this.repository.softDelete({ id } as FindOptionsWhere<T>);
  }

  async getAll(options: IGetAllOptions<T, string[]>): Promise<ICollection<T>> {
    const { filter, page, sort, fields } = options || {};
    const include = this.parseInclude(options?.include);
    const queryBuilder = this.repository.createQueryBuilder('entity');

    this.addJoins(queryBuilder, include);
    this.addFilters(queryBuilder, filter);
    this.addFields(queryBuilder, fields as string[]);
    this.addPagination(queryBuilder, page);
    this.addSorting(queryBuilder, sort);

    const [items, itemCount] = await queryBuilder.getManyAndCount();

    return {
      data: items,
      pageNumber: page?.number,
      pageSize: page?.size,
      pageCount: Math.ceil(itemCount / (page?.size || 1)),
      itemCount,
    };
  }

  async getOneById(id: string): Promise<T | null> {
    return this.repository.findOne({
      where: { id } as FindOptionsWhere<T>,
    });
  }

  async getOneByIdOrFail(id: string): Promise<T> {
    const entity = await this.getOneById(id);

    if (!entity || isEmptyObject(entity)) {
      throw new EntityNotFoundException(id);
    }

    return entity;
  }

  async saveOne(entity: T): Promise<T> {
    return this.repository.save(entity);
  }

  async updateOneOrFail(
    id: string,
    updates: Partial<Omit<T, 'id'>>,
  ): Promise<T> {
    const entityToUpdate = await this.repository.preload({
      ...updates,
      id,
    } as DeepPartial<T>);

    if (!entityToUpdate || isEmptyObject(entityToUpdate)) {
      throw new EntityNotFoundException(id);
    }

    return this.repository.save(entityToUpdate);
  }

  private parseInclude(include?: string | string[]): string[] {
    if (!include) return [];
    if (Array.isArray(include)) return include;
    return include.split(',').map((s) => s.trim());
  }

  private addJoins(
    queryBuilder: ReturnType<Repository<T>['createQueryBuilder']>,
    include: string[],
  ): void {
    include.forEach((relation) => {
      queryBuilder.leftJoinAndSelect(`entity.${relation}`, relation);
    });
  }

  private addFilters(
    queryBuilder: ReturnType<Repository<T>['createQueryBuilder']>,
    filter?: Record<string, unknown>,
  ): void {
    if (!filter) return;

    for (const [key, value] of Object.entries(filter)) {
      if (value && typeof value === 'object' && !Array.isArray(value)) {
        this.addNestedFilters(
          queryBuilder,
          key,
          value as Record<string, unknown>,
        );
      } else if (value !== undefined && value !== null) {
        this.addSimpleFilter(queryBuilder, key, value);
      }
    }
  }

  private addNestedFilters(
    queryBuilder: ReturnType<Repository<T>['createQueryBuilder']>,
    key: string,
    value: Record<string, unknown>,
  ): void {
    queryBuilder.leftJoinAndSelect(`entity.${key}`, key);
    for (const [nestedKey, nestedValue] of Object.entries(value)) {
      if (nestedValue !== undefined && nestedValue !== null) {
        queryBuilder.andWhere(
          `${key}.${nestedKey} ILIKE :${key}_${nestedKey}`,
          { [`${key}_${nestedKey}`]: `%${nestedValue}%` },
        );
      }
    }
  }

  private addSimpleFilter(
    queryBuilder: ReturnType<Repository<T>['createQueryBuilder']>,
    key: string,
    value: unknown,
  ): void {
    const columns = this.repository.metadata.columns;
    const column = columns.find((col) => col.propertyName === key);
    const isStringColumn =
      column &&
      ['varchar', 'text', 'character varying'].includes(column.type as string);

    if (isStringColumn && typeof value === 'string') {
      queryBuilder.andWhere(`entity.${key} ILIKE :${key}`, {
        [key]: `%${value}%`,
      });
    } else {
      queryBuilder.andWhere(`entity.${key} = :${key}`, { [key]: value });
    }
  }

  private addFields(
    queryBuilder: ReturnType<Repository<T>['createQueryBuilder']>,
    fields?: string[],
  ): void {
    if (fields?.length) {
      queryBuilder.select(fields.map((field) => `entity.${String(field)}`));
    }
  }

  private addPagination(
    queryBuilder: ReturnType<Repository<T>['createQueryBuilder']>,
    page?: { offset?: number; size?: number },
  ): void {
    if (page?.offset !== undefined) {
      queryBuilder.skip(page.offset);
    }
    if (page?.size) {
      queryBuilder.take(page.size);
    }
  }

  private addSorting(
    queryBuilder: ReturnType<Repository<T>['createQueryBuilder']>,
    sort?: Record<string, 'ASC' | 'DESC'>,
  ): void {
    if (!sort) return;

    Object.entries(sort).forEach(([key, value]) => {
      queryBuilder.addOrderBy(`entity.${key}`, value);
    });
  }
}

export default BaseRepository;
