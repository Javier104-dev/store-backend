import { AuthorizationModule } from '@module/iam/authorization/authorization.module';
import { Module, Provider } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CreateGenrePolicyHandler } from '@/module/genre/application/policy/create-genre.policy-handler';
import { DeleteGenrePolicyHandler } from '@/module/genre/application/policy/delete-genre.policy-handler';
import { ReadGenrePolicyHandler } from '@/module/genre/application/policy/read-genre.policy-handler';
import { UpdateGenrePolicyHandler } from '@/module/genre/application/policy/update-genre.policy-handler';
import { GENRE_REPOSITORY_KEY } from '@/module/genre/application/repository/genre.repository.interface';
import { GenreCrudUseCase } from '@/module/genre/application/use-cases/genre-crud.use-case';
import { genrePermissions } from '@/module/genre/domain/genre.permission';
import { GenrePostgresRepository } from '@/module/genre/infrastructure/database/genre.postgres.repository';
import { GenreSchema } from '@/module/genre/infrastructure/database/genre.schema';
import { GenreController } from '@/module/genre/interface/genre.controller';

const policyHandlersProviders = [
  ReadGenrePolicyHandler,
  CreateGenrePolicyHandler,
  UpdateGenrePolicyHandler,
  DeleteGenrePolicyHandler,
];

const genreRepositoryProvider: Provider = {
  provide: GENRE_REPOSITORY_KEY,
  useClass: GenrePostgresRepository,
};

@Module({
  imports: [
    TypeOrmModule.forFeature([GenreSchema]),
    AuthorizationModule.forFeature({
      permissions: genrePermissions,
    }),
  ],
  controllers: [GenreController],
  providers: [
    GenreCrudUseCase,
    genreRepositoryProvider,
    ...policyHandlersProviders,
  ],
  exports: [GenreCrudUseCase],
})
export class GenreModule {}
