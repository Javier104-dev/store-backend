import session from 'express-session';
import FileStore from 'session-file-store';

import { ENVIRONMENT } from '@config/environment.enum';

const ONE_DAY_IN_SECONDS = 86400;
const ONE_HOUR_IN_SECONDS = 3600;

const getSessionStore = () => {
  if (process.env.NODE_ENV === ENVIRONMENT.DEVELOPMENT) {
    const FileStoreSession = FileStore(session);
    return new FileStoreSession({
      path: './data/sessions',
      ttl: ONE_DAY_IN_SECONDS,
      retries: 0,
      reapInterval: ONE_HOUR_IN_SECONDS,
      logFn: () => {},
    });
  }

  return undefined;
};

export default getSessionStore;
