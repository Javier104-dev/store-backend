import {
  CART_ITEM_REPOSITORY_KEY,
  ICartItemRepository,
} from '@module/cart/application/repository/cart-item.repository.interface';
import { CartItem } from '@module/cart/domain/cart-item.entity';
import { REQUEST_USER_KEY } from '@module/iam/authentication/authentication.constants';
import { AuthorizationService } from '@module/iam/authorization/application/service/authorization.service';
import { AppAction } from '@module/iam/authorization/domain/app-action.enum';
import { IPolicyHandler } from '@module/iam/authorization/infrastructure/policy/handler/policy-handler.interface';
import { PolicyHandlerStorage } from '@module/iam/authorization/infrastructure/policy/storage/policies-handler.storage';
import { User } from '@module/iam/user/domain/user.entity';
import { Inject, Injectable } from '@nestjs/common';
import { Request } from 'express';

@Injectable()
export class DeleteCartItemPolicyHandler implements IPolicyHandler {
  private readonly action = AppAction.Delete;

  constructor(
    private readonly policyHandlerStorage: PolicyHandlerStorage,
    private readonly authorizationService: AuthorizationService,
    @Inject(CART_ITEM_REPOSITORY_KEY)
    private readonly cartItemRepository: ICartItemRepository,
  ) {
    this.policyHandlerStorage.add(DeleteCartItemPolicyHandler, this);
  }

  async handle(request: Request): Promise<void> {
    const currentUser = this.getCurrentUser(request);
    const subjectOrSubjectCls = (await this.getSubject(request)) ?? CartItem;

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

  private async getSubject(request: Request): Promise<CartItem> {
    return this.cartItemRepository.getOneById(request.params['id'] as string);
  }
}
