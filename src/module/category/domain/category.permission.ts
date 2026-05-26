import { Category } from '@module/category/domain/category.entity';
import { AppAction } from '@module/iam/authorization/domain/app-action.enum';
import { IPermissionsDefinition } from '@module/iam/authorization/infrastructure/policy/type/permissions-definition.interface';

export const categoryPermissions: IPermissionsDefinition = {
  regular() {},
  admin(_, { can }) {
    can(AppAction.Manage, Category);
  },
};
