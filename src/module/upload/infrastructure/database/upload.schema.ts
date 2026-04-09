import { Product } from '@module/product/domain/product.entity';
import { Upload } from '@module/upload/domain/upload.entity';
import { EntitySchema } from 'typeorm';

import { withBaseSchemaColumns } from '@common/base/infrastructure/database/base.schema';

export const UploadSchema = new EntitySchema<Upload>({
  name: Upload.name,
  target: Upload,
  tableName: 'upload',
  columns: withBaseSchemaColumns({
    key: {
      type: String,
      nullable: false,
    },
  }),
  relations: {
    product: {
      type: 'many-to-one',
      target: Product.name,
      nullable: false,
      onDelete: 'CASCADE',
      joinColumn: true,
    },
  },
});
