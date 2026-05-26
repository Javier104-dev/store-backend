export const UPLOAD_FILE_SERVICE = 'upload_file_service';

export interface IUploadFileService {
  uploadFile(file: Express.Multer.File, folder: string): Promise<string>;
  deleteUploads(keys: string[]): Promise<void>;
}
