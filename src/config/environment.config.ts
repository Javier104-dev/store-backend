export const environmentConfig = () => ({
  server: {
    port: Number(process.env.PORT),
    baseUrl: process.env.BASE_APP_URL,
  },
  cognito: {
    userPoolId: process.env.COGNITO_USER_POOL_ID,
    clientId: process.env.COGNITO_CLIENT_ID,
    issuer: process.env.COGNITO_ISSUER,
    endpoint: process.env.COGNITO_ENDPOINT,
  },
  frontend: {
    url: process.env.FRONTEND_URL,
  },
  aws: {
    region: process.env.AWS_REGION,

    endpoint: process.env.AWS_ENDPOINT,

    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
  },
  sqs: {
    endpoint: process.env.SQS_ENDPOINT,
    queue: {
      name: process.env.SQS_QUEUE_NAME,
      url: process.env.SQS_QUEUE_URL,
    },
  },
  s3: {
    bucket: process.env.S3_BUCKET,
  },
  mp: {
    accessToken: process.env.MP_ACCESS_TOKEN,
  },
});
