interface AdminJSEnv {
  BASE_APP_URL: string;
  OPENAI_API_KEY: string;
  OPENAI_DB_ASSISTANT_ID: string;
  OPENAI_DB_FORMATTER_ASSISTANT_ID: string;
}

interface AdminJS {
  env: AdminJSEnv;
}

interface Window {
  AdminJS: AdminJS;
}
