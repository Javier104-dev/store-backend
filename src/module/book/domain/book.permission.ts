import { AppAction } from '@module/iam/authorization/domain/app-action.enum';
import { IPermissionsDefinition } from '@module/iam/authorization/infrastructure/policy/type/permissions-definition.interface';

import { Book } from '@/module/book/domain/book.entity';

export const bookPermissions: IPermissionsDefinition = {
  regular(_, { can }) {
    can(AppAction.Read, Book);
  },
  admin(_, { can }) {
    can(AppAction.Manage, Book);
  },
  superAdmin(_, { can }) {
    can(AppAction.Manage, Book);
  },
};
