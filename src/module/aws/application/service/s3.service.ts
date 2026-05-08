import {
  DeleteObjectsCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { IUploadFileService } from '@module/aws/application/interface/upload-file-service.interface';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import uuid4 from 'uuid4';

@Injectable()
export class AmazonS3Service implements IUploadFileService {
  s3: S3Client;

  constructor(private readonly configService: ConfigService) {
    this.s3 = new S3Client({
      region: this.configService.get('aws.region'),
      //LocalStack
      endpoint: this.configService.get('aws.endpoint'),
      forcePathStyle: true,
      //LocalStack
      credentials: {
        accessKeyId: this.configService.get('aws.credentials.accessKeyId'),
        secretAccessKey: this.configService.get(
          'aws.credentials.secretAccessKey',
        ),
      },
    });
  }

  async uploadFile(file: Express.Multer.File, folder: string): Promise<string> {
    const id = uuid4();
    const positionSlash = file.mimetype.indexOf('/') + 1;
    const key = `${id}.${file.mimetype.slice(positionSlash)}`;
    const fullKey = `${folder}/${key}`;

    const command = new PutObjectCommand({
      Bucket: this.configService.get('s3.bucket'),
      Key: fullKey,
      Body: file.buffer,
      ACL: 'public-read',
      ContentType: file.mimetype,
    });

    await this.s3.send(command);
    return fullKey;
  }

  async deleteUploads(keys: string[]): Promise<void> {
    const command = new DeleteObjectsCommand({
      Bucket: this.configService.get('s3.bucket'),
      Delete: {
        Objects: keys.map((key) => ({ Key: key })),
      },
    });
    await this.s3.send(command);
  }
}
