import { AuthenticationModule } from '@module/iam/authentication/authentication.module';
import { AuthorizationModule } from '@module/iam/authorization/authorization.module';
import { UserModule } from '@module/iam/user/user.module';
import { Module } from '@nestjs/common';

@Module({
  imports: [AuthenticationModule, AuthorizationModule.forRoot(), UserModule],
})
export class IamModule {}
