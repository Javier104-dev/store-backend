import { CartItem } from '@module/cart/domain/cart-item.entity';
import { Cart } from '@module/cart/domain/cart.entity';
import { AppAction } from '@module/iam/authorization/domain/app-action.enum';
import { IPermissionsDefinition } from '@module/iam/authorization/infrastructure/policy/type/permissions-definition.interface';

export const cartPermissions: IPermissionsDefinition = {
  regular(_, { can }) {
    can(AppAction.Read, Cart);
    can(AppAction.Manage, CartItem);
  },
};
