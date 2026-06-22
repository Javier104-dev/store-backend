import { Upload } from '@module/upload/domain/upload.entity';

import IRepository from '@common/base/infrastructure/database/repository.interface';

export const UPLOAD_REPOSITORY_KEY = 'book_repository';

export type IUploadRepository = IRepository<Upload>;
