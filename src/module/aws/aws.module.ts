import { UPLOAD_FILE_SERVICE } from '@module/aws/application/interface/upload-file-service.interface';
import { Global, Module, Provider } from '@nestjs/common';

import { AmazonS3Service } from './application/service/s3.service';
import { AmazonSESService } from './application/service/ses.service';
import { AmazonSNSService } from './application/service/sns.service';
import { AWSController } from './interface/aws.controller';

const uploadFileServiceProvider: Provider = {
  provide: UPLOAD_FILE_SERVICE,
  useClass: AmazonS3Service,
};

@Global()
@Module({
  controllers: [AWSController],
  providers: [AmazonSESService, uploadFileServiceProvider, AmazonSNSService],
  exports: [AmazonSESService, UPLOAD_FILE_SERVICE, AmazonSNSService],
})
export class AwsModule {}
