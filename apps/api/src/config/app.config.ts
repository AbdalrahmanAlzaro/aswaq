// Typed config assembled from process.env (mirrors Safeer's src/config/app.config.ts).
// All env access is centralised here so there is one place to validate/default.
export default () => ({
  app: {
    port: parseInt(process.env.PORT ?? '3001', 10),
    prefix: process.env.APP_PREFIX ?? 'api/v1',
    webOrigin: process.env.WEB_ORIGIN ?? 'http://localhost:3000',
    env: process.env.NODE_ENV ?? 'development',
  },
  database: {
    host: process.env.DB_HOST ?? 'localhost',
    port: parseInt(process.env.DB_PORT ?? '5432', 10),
    username: process.env.DB_USER ?? 'postgres',
    password: process.env.DB_PASSWORD ?? 'postgres',
    name: process.env.DB_NAME ?? 'aswaq',
    synchronize: (process.env.DB_SYNCHRONIZE ?? 'true') === 'true',
    logging: (process.env.DB_LOGGING ?? 'false') === 'true',
  },
  jwt: {
    secret: process.env.JWT_SECRET ?? 'change-me-in-env',
    expiresIn: process.env.JWT_EXPIRES_IN ?? '7d',
  },
});
