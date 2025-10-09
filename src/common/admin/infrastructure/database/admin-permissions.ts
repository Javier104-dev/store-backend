import { AppRole } from '@module/iam/authorization/domain/app-role.enum';
import { User } from '@module/iam/user/domain/user.entity';

export function hasRole(roles: AppRole[]) {
  return function (props: { currentAdmin: User }) {
    let isPermitted = false;
    for (const role of roles) {
      if (props.currentAdmin.roles.includes(role)) {
        isPermitted = true;
      }
    }
    return isPermitted;
  };
}
