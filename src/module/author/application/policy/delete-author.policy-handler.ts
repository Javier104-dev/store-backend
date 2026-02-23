import { REQUEST_USER_KEY } from '@module/iam/authentication/authentication.constants';
import { AuthorizationService } from '@module/iam/authorization/application/service/authorization.service';
import { AppAction } from '@module/iam/authorization/domain/app-action.enum';
import { IPolicyHandler } from '@module/iam/authorization/infrastructure/policy/handler/policy-handler.interface';
import { PolicyHandlerStorage } from '@module/iam/authorization/infrastructure/policy/storage/policies-handler.storage';
import { User } from '@module/iam/user/domain/user.entity';
import { Inject, Injectable } from '@nestjs/common';
import { Request } from 'express';

import {
  AUTHOR_REPOSITORY_KEY,
  IAuthorRepository,
} from '@/module/author/application/repository/author.repository.interface';
import { Author } from '@/module/author/domain/author.entity';

@Injectable()
export class DeleteAuthorPolicyHandler implements IPolicyHandler {
  private readonly action = AppAction.Delete;

  constructor(
    private readonly policyHandlerStorage: PolicyHandlerStorage,
    private readonly authorizationService: AuthorizationService,
    @Inject(AUTHOR_REPOSITORY_KEY)
    private readonly authorRepository: IAuthorRepository,
  ) {
    this.policyHandlerStorage.add(DeleteAuthorPolicyHandler, this);
  }

  async handle(request: Request): Promise<void> {
    const currentUser = this.getCurrentUser(request);
    const subjectOrSubjectCls = (await this.getSubject(request)) ?? Author;

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

  private async getSubject(request: Request): Promise<Author> {
    const searchParam = request.params['id'];
    const subjectId = typeof searchParam === 'string' ? searchParam : undefined;
    return this.authorRepository.getOneById(subjectId);
  }
}
