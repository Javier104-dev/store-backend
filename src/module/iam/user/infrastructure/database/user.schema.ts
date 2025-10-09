import { User } from '@module/iam/user/domain/user.entity';
import { EntitySchema } from 'typeorm';

import { withBaseSchemaColumns } from '@common/base/infrastructure/database/base.schema';
import { ArrayTransformer } from '@common/transformers/array.transformer';

export const UserSchema = new EntitySchema<User>({
  name: 'User',
  target: User,
  tableName: 'user',
  columns: withBaseSchemaColumns({
    username: {
      type: String,
      unique: true,
    },
    externalId: {
      type: String,
      unique: true,
      nullable: true,
    },
    roles: {
      type: String,
      transformer: new ArrayTransformer(),
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
  }),
});
