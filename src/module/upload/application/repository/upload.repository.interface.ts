import { Upload } from '@module/upload/domain/upload.entity';

import BaseRepository from '@common/base/infrastructure/database/base.repository';

export const UPLOAD_REPOSITORY_KEY = 'book_repository';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface IUploadRepository extends BaseRepository<Upload> {}
