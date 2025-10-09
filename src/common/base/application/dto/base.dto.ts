import { IsOptional, IsString } from 'class-validator';
import 'reflect-metadata';

import { IDto } from '@common/base/application/dto/dto.interface';

export function DtoProperty<T extends object>(target: T, propertyKey: string) {
  const DTO_PROPERTIES_KEY = `${target.constructor.name}_PROPERTIES`;
  const properties: string[] =
    Reflect.getMetadata(DTO_PROPERTIES_KEY, target.constructor) || [];
  properties.push(propertyKey);
  Reflect.defineMetadata(DTO_PROPERTIES_KEY, properties, target.constructor);
}

export function getDtoProperties<T extends object>(
  target: new () => T,
): string[] {
  let properties: string[] = [];
  let current = target;
  while (current && current.name !== 'Object') {
    const DTO_PROPERTIES_KEY = `${current.name}_PROPERTIES`;
    properties = [
      ...properties,
      ...(Reflect.getMetadata(DTO_PROPERTIES_KEY, current) || []),
    ];
    current = Object.getPrototypeOf(current);
  }
  return Array.from(new Set(properties));
}

export abstract class BaseDto implements IDto {
  @DtoProperty
  @IsString()
  @IsOptional()
  id?: string;
}
