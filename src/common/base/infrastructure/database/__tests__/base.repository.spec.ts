import { Test } from '@nestjs/testing';
import { DataSource, Repository } from 'typeorm';

import { Base } from '@common/base/domain/base.entity';
import BaseRepository from '@common/base/infrastructure/database/base.repository';
import EntityNotFoundException from '@common/base/infrastructure/database/exception/not-found.exception';

class TestEntity extends Base {
  name: string;
}

describe('BaseRepository Integration Tests', () => {
  let repository: Repository<TestEntity>;
  let baseRepository: BaseRepository<TestEntity>;
  let dataSource: DataSource;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        {
          provide: DataSource,
          useValue: {
            getRepository: jest.fn().mockReturnValue({
              findOne: jest.fn(),
              preload: jest.fn(),
              save: jest.fn(),
              softDelete: jest.fn(),
            }),
          },
        },
      ],
    }).compile();

    dataSource = moduleRef.get<DataSource>(DataSource);
    repository = dataSource.getRepository(TestEntity);
    baseRepository = new BaseRepository<TestEntity>(repository);
  });

  describe('deleteOneOrFail', () => {
    it('should throw EntityNotFoundException when entity is empty object', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValueOnce({} as TestEntity);

      await expect(baseRepository.deleteOneOrFail('test-id')).rejects.toThrow(
        EntityNotFoundException,
      );
    });
  });

  describe('getOneByIdOrFail', () => {
    it('should throw EntityNotFoundException when entity is empty object', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValueOnce({} as TestEntity);

      await expect(baseRepository.getOneByIdOrFail('test-id')).rejects.toThrow(
        EntityNotFoundException,
      );
    });
  });

  describe('updateOneOrFail', () => {
    it('should throw EntityNotFoundException when entity is empty object', async () => {
      jest.spyOn(repository, 'preload').mockResolvedValueOnce({} as TestEntity);

      await expect(
        baseRepository.updateOneOrFail('test-id', { name: 'test' }),
      ).rejects.toThrow(EntityNotFoundException);
    });
  });
});
