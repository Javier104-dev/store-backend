import { UploadMapper } from '@module/upload/application/mapper/upload.mapper';
import { UPLOAD_REPOSITORY_KEY } from '@module/upload/application/repository/upload.repository.interface';
import { UploadService } from '@module/upload/application/service/upload.service';
import { UploadPostgresRepository } from '@module/upload/infrastructure/database/upload.postgres.repository';
import { UploadSchema } from '@module/upload/infrastructure/database/upload.schema';
import { Module, Provider } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

const uploadRepositoryProvider: Provider = {
  provide: UPLOAD_REPOSITORY_KEY,
  useClass: UploadPostgresRepository,
};

@Module({
  imports: [TypeOrmModule.forFeature([UploadSchema])],
  providers: [UploadService, UploadMapper, uploadRepositoryProvider],
  exports: [UploadService],
})
export class UploadModule {}
