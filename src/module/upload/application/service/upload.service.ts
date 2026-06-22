import { UploadDto } from '@module/upload/application/dto/upload.dto';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UploadService {
  constructor(private readonly configService: ConfigService) {}

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
