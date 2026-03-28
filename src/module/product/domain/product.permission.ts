import { AppAction } from '@module/iam/authorization/domain/app-action.enum';
import { IPermissionsDefinition } from '@module/iam/authorization/infrastructure/policy/type/permissions-definition.interface';
import { Product } from '@module/product/domain/product.entity';

export const productPermissions: IPermissionsDefinition = {
  regular() {},
  admin(_, { can }) {
    can(AppAction.Manage, Product);
  },
  superAdmin(_, { can }) {
    can(AppAction.Manage, Product);
  },
};
