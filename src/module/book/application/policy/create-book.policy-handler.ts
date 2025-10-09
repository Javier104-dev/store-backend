import { REQUEST_USER_KEY } from '@module/iam/authentication/authentication.constants';
import { AuthorizationService } from '@module/iam/authorization/application/service/authorization.service';
import { AppAction } from '@module/iam/authorization/domain/app-action.enum';
import { IPolicyHandler } from '@module/iam/authorization/infrastructure/policy/handler/policy-handler.interface';
import { PolicyHandlerStorage } from '@module/iam/authorization/infrastructure/policy/storage/policies-handler.storage';
import { User } from '@module/iam/user/domain/user.entity';
import { Injectable } from '@nestjs/common';
import { Request } from 'express';

import { Book } from '@/module/book/domain/book.entity';

@Injectable()
export class CreateBookPolicyHandler implements IPolicyHandler {
  private readonly action = AppAction.Create;

  constructor(
    private readonly policyHandlerStorage: PolicyHandlerStorage,
    private readonly authorizationService: AuthorizationService,
  ) {
    this.policyHandlerStorage.add(CreateBookPolicyHandler, this);
  }

  async handle(request: Request): Promise<void> {
    const currentUser = this.getCurrentUser(request);

    const isAllowed = await this.authorizationService.isAllowed(
      currentUser,
      this.action,
      Book,
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
}
