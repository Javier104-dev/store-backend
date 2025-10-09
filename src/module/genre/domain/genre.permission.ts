import { AppAction } from '@module/iam/authorization/domain/app-action.enum';
import { IPermissionsDefinition } from '@module/iam/authorization/infrastructure/policy/type/permissions-definition.interface';

import { Genre } from '@/module/genre/domain/genre.entity';

export const genrePermissions: IPermissionsDefinition = {
  regular(_, { can }) {
    can(AppAction.Read, Genre);
  },
  admin(_, { can }) {
    can(AppAction.Manage, Genre);
  },
  superAdmin(_, { can }) {
    can(AppAction.Manage, Genre);
  },
};
