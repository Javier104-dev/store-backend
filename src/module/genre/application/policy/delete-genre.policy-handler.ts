import { REQUEST_USER_KEY } from '@module/iam/authentication/authentication.constants';
import { AuthorizationService } from '@module/iam/authorization/application/service/authorization.service';
import { AppAction } from '@module/iam/authorization/domain/app-action.enum';
import { IPolicyHandler } from '@module/iam/authorization/infrastructure/policy/handler/policy-handler.interface';
import { PolicyHandlerStorage } from '@module/iam/authorization/infrastructure/policy/storage/policies-handler.storage';
import { User } from '@module/iam/user/domain/user.entity';
import { Inject, Injectable } from '@nestjs/common';
import { Request } from 'express';

import {
  GENRE_REPOSITORY_KEY,
  IGenreRepository,
} from '@/module/genre/application/repository/genre.repository.interface';
import { Genre } from '@/module/genre/domain/genre.entity';

@Injectable()
export class DeleteGenrePolicyHandler implements IPolicyHandler {
  private readonly action = AppAction.Delete;

  constructor(
    private readonly policyHandlerStorage: PolicyHandlerStorage,
    private readonly authorizationService: AuthorizationService,
    @Inject(GENRE_REPOSITORY_KEY)
    private readonly genreRepository: IGenreRepository,
  ) {
    this.policyHandlerStorage.add(DeleteGenrePolicyHandler, this);
  }

  async handle(request: Request): Promise<void> {
    const currentUser = this.getCurrentUser(request);
    const subjectOrSubjectCls = (await this.getSubject(request)) ?? Genre;

    const isAllowed = this.authorizationService.isAllowed(
      currentUser,
      this.action,
      subjectOrSubjectCls,
    );

    if (!isAllowed) {
      throw new Error(
        `You are not allowed to ${this.action.toUpperCase()} this resource`,
      );
    }
  }

  private getCurrentUser(request: Request): User {
    return request[REQUEST_USER_KEY];
  }

  private async getSubject(request: Request): Promise<Genre> {
    const searchParam = request.params['id'];
    const subjectId = searchParam ? searchParam : undefined;
    return this.genreRepository.getOneById(subjectId);
  }
}
