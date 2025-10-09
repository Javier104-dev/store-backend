import getSessionStore from '@module/adminjs/utils/get-session-store.util';
import importESMModule from '@module/adminjs/utils/import-esm-modules.util';
import { AuthenticationService } from '@module/iam/authentication/application/service/authentication.service';
import { AuthenticationModule } from '@module/iam/authentication/authentication.module';
import { AuthenticationProvider } from '@module/iam/authentication/infrastructure/admin/admin-authentication.provider';
import { USER_REPOSITORY_KEY } from '@module/iam/user/application/repository/user.repository.interface';
import { UserService } from '@module/iam/user/application/service/user.service';
import { UserModule } from '@module/iam/user/user.module';
import { DataSource } from 'typeorm';

import {
  adminResources,
  adminSchemas,
} from '@common/admin/infrastructure/database/admin-resource';

import { ENVIRONMENT } from '@config/environment.enum';
import { datasourceOptions } from '@config/orm.config';

import { TestingEmptyModule } from '@test/test.empty.module';

import { loadComponents } from '@/module/adminjs/components/components';
import {
  BIGGER_LOGO_FAVICON_URL,
  BIGGER_LOGO_URL,
} from '@/module/adminjs/constant/logo-bigger.constant';

import { configureExportCsvFeature } from '../features/export-csv/export-csv.feature';

export const initializeAdminJS = async (
  authenticationService: AuthenticationService,
  userService: UserService,
) => {
  const { componentLoader, Components } = await loadComponents();

  const ADMIN_JS_ROOT_PATH = '/admin';
  const COOKIE_NAME = 'adminjs-session-cookie';

  const dataSource = await new DataSource({
    ...datasourceOptions,
    entities: adminSchemas,
  }).initialize();

  const resourcesWithExport = await configureExportCsvFeature(
    adminResources,
    dataSource,
    componentLoader,
  );

  return {
    adminJsOptions: {
      rootPath: ADMIN_JS_ROOT_PATH,
      componentLoader,
      dashboard: {
        component: Components.Dashboard,
      },
      branding: {
        companyName: 'Bigger - Admin Panel',
        logo: BIGGER_LOGO_URL,
        favicon: BIGGER_LOGO_FAVICON_URL,
        withMadeWithLove: false,
        softwareBrothers: false,
      },
      env: {
        BASE_APP_URL: process.env.BASE_APP_URL,
        OPENAI_API_KEY: process.env.OPENAI_API_KEY,
        OPENAI_DB_ASSISTANT_ID: process.env.OPENAI_DB_ASSISTANT_ID,
        OPENAI_DB_FORMATTER_ASSISTANT_ID:
          process.env.OPENAI_DB_FORMATTER_ASSISTANT_ID,
      },
      assets: {
        styles: [
          'https://cdn.jsdelivr.net/npm/react-toastify@10.0.6/dist/ReactToastify.min.css',
          'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.10.0/styles/vs2015.min.css',
        ],
      },
      pages: {
        'chat-with-your-database': {
          component: Components.ChatWithYourDatabase,
        },
        Metrics: {
          component: Components.Metrics,
        },
      },
      resources: resourcesWithExport,
    },
    auth: {
      provider: new AuthenticationProvider(authenticationService, userService),
      enable: true,
      secret: process.env.ADMINJS_SECRET,
      cookieName: COOKIE_NAME,
      cookiePassword: process.env.ADMINJS_COOKIE_PASSWORD,
    },
    sessionOptions: {
      resave: false,
      saveUninitialized: true,
      store: getSessionStore(),
      secret: process.env.ADMINJS_SECRET,
      name: COOKIE_NAME,
      cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === ENVIRONMENT.PRODUCTION,
        maxAge: 24 * 60 * 60 * 1000,
      },
    },
  };
};

export const getAdminJSModule = async () => {
  if (process.env.NODE_ENV === ENVIRONMENT.AUTOMATED_TESTS) {
    return TestingEmptyModule;
  }

  const { AdminModule } = await importESMModule('@adminjs/nestjs');

  return AdminModule.createAdminAsync({
    imports: [AuthenticationModule, UserModule],
    useFactory: async (
      authenticationService: AuthenticationService,
      userService: UserService,
    ) => initializeAdminJS(authenticationService, userService),
    inject: [AuthenticationService, USER_REPOSITORY_KEY],
  });
};
