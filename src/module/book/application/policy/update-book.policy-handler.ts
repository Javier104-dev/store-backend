import { REQUEST_USER_KEY } from '@module/iam/authentication/authentication.constants';
import { AuthorizationService } from '@module/iam/authorization/application/service/authorization.service';
import { AppAction } from '@module/iam/authorization/domain/app-action.enum';
import { IPolicyHandler } from '@module/iam/authorization/infrastructure/policy/handler/policy-handler.interface';
import { PolicyHandlerStorage } from '@module/iam/authorization/infrastructure/policy/storage/policies-handler.storage';
import { User } from '@module/iam/user/domain/user.entity';
import { Inject, Injectable } from '@nestjs/common';
import { Request } from 'express';

import {
  BOOK_REPOSITORY_KEY,
  IBookRepository,
} from '@/module/book/application/repository/book.repository.interface';
import { Book } from '@/module/book/domain/book.entity';

@Injectable()
export class UpdateBookPolicyHandler implements IPolicyHandler {
  private readonly action = AppAction.Update;

  constructor(
    private readonly policyHandlerStorage: PolicyHandlerStorage,
    private readonly authorizationService: AuthorizationService,
    @Inject(BOOK_REPOSITORY_KEY)
    private readonly bookRepository: IBookRepository,
  ) {
    this.policyHandlerStorage.add(UpdateBookPolicyHandler, this);
  }

  async handle(request: Request): Promise<void> {
    const currentUser = this.getCurrentUser(request);
    const subjectOrSubjectCls = (await this.getSubject(request)) ?? Book;

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

  private async getSubject(request: Request): Promise<Book> {
    return this.bookRepository.getOneById(request.params['id'] as string);
  }
}
