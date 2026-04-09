import { Upload } from '@module/upload/domain/upload.entity';
import { UploadSchema } from '@module/upload/infrastructure/database/upload.schema';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import BaseRepository from '@common/base/infrastructure/database/base.repository';

@Injectable()
export class UploadPostgresRepository extends BaseRepository<Upload> {
  constructor(
    @InjectRepository(UploadSchema)
    protected readonly repository: Repository<Upload>,
  ) {
    super(repository);
  }
}
