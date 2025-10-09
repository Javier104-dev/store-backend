import { AppAction } from '@module/iam/authorization/domain/app-action.enum';
import { IPermissionsDefinition } from '@module/iam/authorization/infrastructure/policy/type/permissions-definition.interface';

import { Author } from '@/module/author/domain/author.entity';

export const authorPermissions: IPermissionsDefinition = {
  regular(_, { can }) {
    can(AppAction.Read, Author);
  },
  admin(_, { can }) {
    can(AppAction.Manage, Author);
  },
  superAdmin(_, { can }) {
    can(AppAction.Manage, Author);
  },
};
