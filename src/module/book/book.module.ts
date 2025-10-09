import { AuthorizationModule } from '@module/iam/authorization/authorization.module';
import { Module, Provider } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CreateBookPolicyHandler } from '@/module/book/application/policy/create-book.policy-handler';
import { DeleteBookPolicyHandler } from '@/module/book/application/policy/delete-book.policy-handler';
import { ReadBookPolicyHandler } from '@/module/book/application/policy/read-book.policy-handler';
import { UpdateBookPolicyHandler } from '@/module/book/application/policy/update-book.policy-handler';
import { BOOK_REPOSITORY_KEY } from '@/module/book/application/repository/book.repository.interface';
import { BookCrudUseCase } from '@/module/book/application/use-cases/book-crud.use-case';
import { bookPermissions } from '@/module/book/domain/book.permission';
import { BookPostgresRepository } from '@/module/book/infrastructure/database/book.postgres.repository';
import { BookSchema } from '@/module/book/infrastructure/database/book.schema';
import { BookController } from '@/module/book/interface/book.controller';

const policyHandlersProviders = [
  ReadBookPolicyHandler,
  CreateBookPolicyHandler,
  UpdateBookPolicyHandler,
  DeleteBookPolicyHandler,
];

const bookRepositoryProvider: Provider = {
  provide: BOOK_REPOSITORY_KEY,
  useClass: BookPostgresRepository,
};

@Module({
  imports: [
    TypeOrmModule.forFeature([BookSchema]),
    AuthorizationModule.forFeature({
      permissions: bookPermissions,
    }),
  ],
  controllers: [BookController],
  providers: [
    BookCrudUseCase,
    bookRepositoryProvider,
    ...policyHandlersProviders,
  ],
  exports: [BookCrudUseCase],
})
export class BookModule {}
