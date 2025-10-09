import { ReadUserPolicyHandler } from '@module/iam/authentication/application/policy/read-user-policy.handler';
import { AuthorizationModule } from '@module/iam/authorization/authorization.module';
import { UserMapper } from '@module/iam/user/application/mapper/user.mapper';
import { USER_REPOSITORY_KEY } from '@module/iam/user/application/repository/user.repository.interface';
import { UserService } from '@module/iam/user/application/service/user.service';
import { userPermissions } from '@module/iam/user/domain/user.permission';
import { UserPostgresRepository } from '@module/iam/user/infrastructure/database/user.postgres.repository';
import { UserSchema } from '@module/iam/user/infrastructure/database/user.schema';
import { UserController } from '@module/iam/user/interface/user.controller';
import { Module, Provider } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

const policyHandlersProviders = [ReadUserPolicyHandler];

const userRepositoryProvider: Provider = {
  provide: USER_REPOSITORY_KEY,
  useClass: UserPostgresRepository,
};

@Module({
  imports: [
    TypeOrmModule.forFeature([UserSchema]),
    AuthorizationModule.forFeature({ permissions: userPermissions }),
  ],
  controllers: [UserController],
  providers: [
    UserService,
    userRepositoryProvider,
    ...policyHandlersProviders,
    UserMapper,
  ],
  exports: [UserService, userRepositoryProvider],
})
export class UserModule {}
