import { AwsModule } from '@module/aws/aws.module';
import { UPLOAD_REPOSITORY_KEY } from '@module/upload/application/repository/upload.repository.interface';
import { UploadCrudUseCase } from '@module/upload/application/use-cases/upload-crud.use-case';
import { UploadPostgresRepository } from '@module/upload/infrastructure/database/upload.postgres.repository';
import { UploadSchema } from '@module/upload/infrastructure/database/upload.schema';
import { Module, Provider } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

const uploadRepositoryProvider: Provider = {
  provide: UPLOAD_REPOSITORY_KEY,
  useClass: UploadPostgresRepository,
};

@Module({
  imports: [TypeOrmModule.forFeature([UploadSchema]), AwsModule],
  providers: [UploadCrudUseCase, uploadRepositoryProvider],
  exports: [UploadCrudUseCase],
})
export class UploadModule {}
