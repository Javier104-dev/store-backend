import { AppAction } from '@module/iam/authorization/domain/app-action.enum';
import { IPermissionsDefinition } from '@module/iam/authorization/infrastructure/policy/type/permissions-definition.interface';
import { Store } from '@module/store/domain/store.entity';

export const storePermissions: IPermissionsDefinition = {
  regular() {},
  admin(_, { can }) {
    can(AppAction.Manage, Store);
  },
};
