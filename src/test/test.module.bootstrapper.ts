import { AppModule } from '@module/app.module';
import {
  IUploadFileService,
  UPLOAD_FILE_SERVICE,
} from '@module/aws/application/interface/upload-file-service.interface';
import {
  IDENTITY_PROVIDER_SERVICE_KEY,
  IIdentityProviderService,
} from '@module/iam/authentication/application/service/identity-provider.service.interface';
import { NestExpressApplication } from '@nestjs/platform-express';
import { Test } from '@nestjs/testing';
import { initializeTransactionalContext } from 'typeorm-transactional';

import { setupApp } from '@config/app.config';

export const identityProviderServiceMock: jest.MockedObject<IIdentityProviderService> =
  {
    signUp: jest.fn(),
    signIn: jest.fn(),
    confirmUser: jest.fn(),
    forgotPassword: jest.fn(),
    confirmPassword: jest.fn(),
    resendConfirmationCode: jest.fn(),
    refreshSession: jest.fn(),
  };

export const uploadFileServiceMock: jest.MockedObject<IUploadFileService> = {
  uploadFile: jest.fn(),
  deleteUploads: jest.fn(),
};

export const createTestApp = async (): Promise<NestExpressApplication> => {
  initializeTransactionalContext();

  const moduleRef = await Test.createTestingModule({
    imports: [AppModule],
  })
    .overrideProvider(IDENTITY_PROVIDER_SERVICE_KEY)
    .useValue(identityProviderServiceMock)
    .overrideProvider(UPLOAD_FILE_SERVICE)
    .useValue(uploadFileServiceMock)
    .compile();
  const app = moduleRef.createNestApplication<NestExpressApplication>();
  app.set('query parser', 'extended');
  setupApp(app);
  return app.init();
};
