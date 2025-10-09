import importESMModule from '@module/adminjs/utils/import-esm-modules.util';
import { validate } from 'class-validator';

const registerDatabaseOnAdminJS = async () => {
  const adminJSModule = await importESMModule('adminjs');
  const AdminJS = adminJSModule.default;

  const { Database, Resource } = await importESMModule('@adminjs/typeorm');

  Resource.validate = validate;
  AdminJS.registerAdapter({ Database, Resource });
};

export default registerDatabaseOnAdminJS;
