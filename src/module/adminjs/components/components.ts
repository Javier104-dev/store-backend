import importESMModule from '@module/adminjs/utils/import-esm-modules.util';
import path from 'path';

export const loadComponents = async () => {
  const adminJSModule = await importESMModule('adminjs');
  const { ComponentLoader } = adminJSModule;
  const componentLoader = new ComponentLoader();

  const Components = {
    ChatWithYourDatabase: componentLoader.add(
      'ChatWithYourDatabase',
      path.resolve(__dirname, '../app/pages/ChatWithYourDatabase'),
    ),
    Dashboard: componentLoader.add(
      'Dashboard',
      path.resolve(__dirname, '../app/components/Dashboard'),
    ),
    Metrics: componentLoader.add(
      'Metrics',
      path.resolve(__dirname, '../app/pages/Metrics'),
    ),
  };

  componentLoader.override(
    'Login',
    path.resolve(__dirname, '../app/pages/CustomAuth'),
  );

  return { componentLoader, Components };
};
