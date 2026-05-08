import { UploadDto } from '@module/upload/application/dto/upload.dto';
import { PartialType } from '@nestjs/swagger';

export class UpdateUploadDto extends PartialType(UploadDto) {}
