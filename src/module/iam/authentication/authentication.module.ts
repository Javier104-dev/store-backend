import { CreateUserPolicyHandler } from '@module/iam/authentication/application/policy/create-user-policy.handler';
import { AuthenticationService } from '@module/iam/authentication/application/service/authentication.service';
import { IDENTITY_PROVIDER_SERVICE_KEY } from '@module/iam/authentication/application/service/identity-provider.service.interface';
import { CognitoService } from '@module/iam/authentication/infrastructure/cognito/cognito.service';
import { AccessTokenGuard } from '@module/iam/authentication/infrastructure/guard/access-token.guard';
import { AuthenticationGuard } from '@module/iam/authentication/infrastructure/guard/authentication.guard';
import { JwtStrategy } from '@module/iam/authentication/infrastructure/passport/jwt.strategy';
import { AuthenticationController } from '@module/iam/authentication/interface/authentication.controller';
import { AuthorizationModule } from '@module/iam/authorization/authorization.module';
import { userPermissions } from '@module/iam/user/domain/user.permission';
import { UserModule } from '@module/iam/user/user.module';
import {
  MiddlewareConsumer,
  Module,
  NestModule,
  Provider,
  RequestMethod,
} from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { PassportModule } from '@nestjs/passport';

import { EmailDomainMiddleware } from './infrastructure/middleware/email-domain.middleware';

const authenticationRepositoryProvider: Provider = {
  provide: IDENTITY_PROVIDER_SERVICE_KEY,
  useClass: CognitoService,
};

const policyHandlersProviders = [CreateUserPolicyHandler];

@Module({
  imports: [
    PassportModule,
    UserModule,
    AuthorizationModule.forFeature({ permissions: userPermissions }),
  ],
  controllers: [AuthenticationController],
  providers: [
    JwtStrategy,
    AccessTokenGuard,
    { provide: APP_GUARD, useClass: AuthenticationGuard },
    AuthenticationController,
    AuthenticationService,
    authenticationRepositoryProvider,
    ...policyHandlersProviders,
  ],
  exports: [AuthenticationService, authenticationRepositoryProvider],
})
export class AuthenticationModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(EmailDomainMiddleware).forRoutes({
      path: '*auth/sign-up',
      method: RequestMethod.POST,
    });
  }
}
