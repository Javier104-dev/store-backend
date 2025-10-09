import { AuthorizationModule } from '@module/iam/authorization/authorization.module';
import { Module, Provider } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CreateAuthorPolicyHandler } from '@/module/author/application/policy/create-author.policy-handler';
import { DeleteAuthorPolicyHandler } from '@/module/author/application/policy/delete-author.policy-handler';
import { ReadAuthorPolicyHandler } from '@/module/author/application/policy/read-author.policy-handler';
import { UpdateAuthorPolicyHandler } from '@/module/author/application/policy/update-author.policy-handler';
import { AUTHOR_REPOSITORY_KEY } from '@/module/author/application/repository/author.repository.interface';
import { AuthorCrudUseCase } from '@/module/author/application/use-cases/author-crud.use-case';
import { authorPermissions } from '@/module/author/domain/author.permission';
import { AuthorPostgresRepository } from '@/module/author/infrastructure/database/author.postgres.repository';
import { AuthorSchema } from '@/module/author/infrastructure/database/author.schema';
import { AuthorController } from '@/module/author/interface/author.controller';

const policyHandlersProviders = [
  ReadAuthorPolicyHandler,
  CreateAuthorPolicyHandler,
  UpdateAuthorPolicyHandler,
  DeleteAuthorPolicyHandler,
];

const authorRepositoryProvider: Provider = {
  provide: AUTHOR_REPOSITORY_KEY,
  useClass: AuthorPostgresRepository,
};

@Module({
  imports: [
    TypeOrmModule.forFeature([AuthorSchema]),
    AuthorizationModule.forFeature({
      permissions: authorPermissions,
    }),
  ],
  controllers: [AuthorController],
  providers: [
    AuthorCrudUseCase,
    authorRepositoryProvider,
    ...policyHandlersProviders,
  ],
  exports: [AuthorCrudUseCase],
})
export class AuthorModule {}
