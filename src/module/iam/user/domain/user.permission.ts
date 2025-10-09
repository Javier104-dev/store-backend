import { AppAction } from '@module/iam/authorization/domain/app-action.enum';
import { IPermissionsDefinition } from '@module/iam/authorization/infrastructure/policy/type/permissions-definition.interface';
import { User } from '@module/iam/user/domain/user.entity';

export const userPermissions: IPermissionsDefinition = {
  regular(user, { can }) {
    can(AppAction.Read, User);
    can(AppAction.Update, User, { id: user.id });
  },
  admin(_, { can }) {
    can(AppAction.Read, User);
    can(AppAction.Update, User);
  },
  superAdmin(_, { can }) {
    can(AppAction.Manage, User);
  },
};
