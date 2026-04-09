import { AmazonS3Service } from '@module/aws/application/service/s3.service';
import { BookDto } from '@module/book/application/dto/book.dto';
import { CreateBookDto } from '@module/book/application/dto/create-book.dto';
import { UpdateBookDto } from '@module/book/application/dto/update-book.dto';
import { Product } from '@module/product/domain/product.entity';
import {
  IUploadRepository,
  UPLOAD_REPOSITORY_KEY,
} from '@module/upload/application/repository/upload.repository.interface';
import { Upload } from '@module/upload/domain/upload.entity';
import { Inject, Injectable } from '@nestjs/common';

import { BaseResponseAdapter } from '@common/base/application/adapter/base-response.adapter';
import { DtoMapper } from '@common/base/application/mapper/dto.mapper';
import BaseCrudUseCase from '@common/base/application/use-case/base.crud.use-case';

@Injectable()
export class UploadCrudUseCase extends BaseCrudUseCase<
  Upload,
  BookDto,
  CreateBookDto,
  UpdateBookDto
> {
  constructor(
    @Inject(UPLOAD_REPOSITORY_KEY)
    repository: IUploadRepository,
    mapper: DtoMapper,
    responseAdapter: BaseResponseAdapter,
    private readonly amazonS3Service: AmazonS3Service,
  ) {
    super(repository, mapper, responseAdapter, Upload.getEntityName());
  }

  async uploadFile(
    file: Express.Multer.File,
    folder: string,
    product: Product,
  ): Promise<Upload> {
    const key = await this.amazonS3Service.uploadFile(file, folder);
    const upload = this.mapper.toEntity<Upload>({ key, product });
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
        return this.mapper.toEntity<Upload>({ key, product });
      }),
    );
    return this.saveRawMany(uploads);
  }
}
