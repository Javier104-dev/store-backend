import { AppRole } from '@module/iam/authorization/domain/app-role.enum';
import { DefinePermissions } from '@module/iam/authorization/infrastructure/policy/type/define-permissions.type';

export interface IPermissionsDefinition
  extends Partial<Record<AppRole, DefinePermissions>> {}
