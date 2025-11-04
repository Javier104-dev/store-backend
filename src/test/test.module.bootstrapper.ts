import { AppModule } from '@module/app.module';
import {
  IDENTITY_PROVIDER_SERVICE_KEY,
  IIdentityProviderService,
} from '@module/iam/authentication/application/service/identity-provider.service.interface';
import { Test, TestingModule } from '@nestjs/testing';
import { initializeTransactionalContext } from 'typeorm-transactional';

import {
  DATABASE_SERVICE_KEY,
  IDatabaseService,
} from '@/module/db/application/interfaces/database.service.interfaces';
import { DatabaseService } from '@/module/db/application/service/database.service';

export const databaseServiceMock: jest.MockedObject<IDatabaseService> = {
  executeQuery: jest.fn(),
  allModels: jest.fn(),
  getTableSchema: jest.fn(),
  databaseInfo: jest.fn(),
};

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

export const testModuleBootstrapper = async (): Promise<TestingModule> => {
  initializeTransactionalContext();

  return Test.createTestingModule({
    imports: [AppModule],
    providers: [
      {
        provide: DATABASE_SERVICE_KEY,
        useClass: DatabaseService,
      },
    ],
  })
    .overrideProvider(IDENTITY_PROVIDER_SERVICE_KEY)
    .useValue(identityProviderServiceMock)
    .compile();
};
