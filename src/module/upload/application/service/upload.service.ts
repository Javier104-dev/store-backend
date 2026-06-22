import {
  IUploadFileService,
  UPLOAD_FILE_SERVICE,
} from '@module/aws/application/interface/upload-file-service.interface';
import { Product } from '@module/product/domain/product.entity';
import { UploadDto } from '@module/upload/application/dto/upload.dto';
import { UploadMapper } from '@module/upload/application/mapper/upload.mapper';
import {
  IUploadRepository,
  UPLOAD_REPOSITORY_KEY,
} from '@module/upload/application/repository/upload.repository.interface';
import { Upload } from '@module/upload/domain/upload.entity';
import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UploadService {
  constructor(
    @Inject(UPLOAD_REPOSITORY_KEY)
    private readonly repository: IUploadRepository,
    private readonly uploadMapper: UploadMapper,
    @Inject(UPLOAD_FILE_SERVICE)
    private readonly amazonS3Service: IUploadFileService,
    private readonly configService: ConfigService,
  ) {}

  async uploadFile(
    file: Express.Multer.File,
    folder: string,
    product: Product,
  ): Promise<Upload> {
    const key = await this.amazonS3Service.uploadFile(file, folder);
    const upload = this.uploadMapper.toEntity<Upload>({ key, product });
    return this.saveRawOne(upload);
  }

  async uploadFiles(
    files: Express.Multer.File[],
    folder: string,
    product: Product,
  ): Promise<Upload[]> {
    const uploads = await Promise.all(
      files.map(async (file) => {
        const key = await this.amazonS3Service.uploadFile(file, folder);
        return this.uploadMapper.toEntity<Upload>({ key, product });
      }),
    );
    return this.saveRawMany(uploads);
  }

  async deleteManyFiles(uploads: Upload[]): Promise<void> {
    const ids = uploads.map((upload) => upload.id);
    const keys = uploads.map((upload) => upload.key);

    await this.deleteMany(ids);
    await this.amazonS3Service.deleteUploads(keys);
  }

  async deleteOneOrFail(id: string): Promise<void> {
    return this.repository.deleteOneOrFail(id);
  }

  async saveRawOne(entity: Upload): Promise<Upload> {
    return this.repository.saveOne(entity);
  }

  async saveRawMany(entities: Upload[]): Promise<Upload[]> {
    return this.repository.saveMany(entities);
  }

  async deleteMany(ids: string[]): Promise<void> {
    return this.repository.deleteMany(ids);
  }

  transformUploadIncluded() {
    return {
      upload: (rel: UploadDto) => ({
        ...rel,
        url: this.buildUrl(rel.key),
      }),
    };
  }

  private buildUrl(key: string) {
    return `${this.configService.get('aws.endpoint')}/${this.configService.get('s3.bucket')}/${key}`;
  }
}
