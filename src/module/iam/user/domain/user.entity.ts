import { AppRole } from '@module/iam/authorization/domain/app-role.enum';

import { Base } from '@common/base/domain/base.entity';

export class User extends Base {
  username: string;
  externalId?: string;
  roles: AppRole[];
  isVerified: boolean;
  email: string;

  constructor(
    username: string,
    roles: AppRole[],
    externalId?: string,
    id?: string,
    createdAt?: string,
    updatedAt?: string,
    deletedAt?: string,
    isVerified?: boolean,
  ) {
    super(id, createdAt, updatedAt, deletedAt);
    this.username = username;
    this.externalId = externalId;
    this.roles = roles;
    this.isVerified = isVerified;
    this.email = username;
  }
}
