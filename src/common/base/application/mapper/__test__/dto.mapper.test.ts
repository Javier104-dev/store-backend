import { DtoMapper } from '@common/base/application/mapper/dto.mapper';
import { MapperOption } from '@common/base/application/mapper/mapper.option';

describe('DtoMapper', () => {
  let dtoMapper: DtoMapper;

  beforeEach(() => {
    dtoMapper = new DtoMapper();
  });

  describe('fromEntity method', () => {
    it('should correctly apply transformations', () => {
      const entity = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        name: 'Test Name',
        email: 'test@example.com',
      };
      const mapperOption = new MapperOption({
        transforms: [
          {
            fieldName: 'name',
            transformer: (value: string) => `Transformed ${value}`,
          },
        ],
      });

      const expectedDto = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        name: 'Transformed Test Name',
        email: 'test@example.com',
      };

      const transformedDto = dtoMapper.fromEntity(entity, mapperOption);

      expect(transformedDto).toEqual(expectedDto);
    });

    it('should exclude specified fields from the DTO', () => {
      const entity = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        name: 'Exclude Test',
        email: 'exclude@example.com',
        password: 'secret',
      };
      const mapperOption = new MapperOption({
        exclude: ['password'],
      });

      const expectedDto = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        name: 'Exclude Test',
        email: 'exclude@example.com',
      };

      const dto = dtoMapper.fromEntity(entity, mapperOption);

      expect(dto).toEqual(expectedDto);
    });

    it('should include only specified fields in the DTO', () => {
      const entity = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        name: 'Include Test',
        email: 'include@example.com',
        created_at: new Date(),
      };
      const mapperOption = new MapperOption({
        include: ['id', 'name', 'email'],
      });

      const expectedDto = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        name: 'Include Test',
        email: 'include@example.com',
      };

      const dto = dtoMapper.fromEntity(entity, mapperOption);

      expect(dto).toEqual(expectedDto);
    });
  });
});
