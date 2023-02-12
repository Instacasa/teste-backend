export default {
  development: {
    type: "sqlite",
    database: process.env.DB_TEST || ":memory:",
    dropSchema: false,
    synchronize: true,
    logging: false,
  },
  test: {
    type: "sqlite",
    database: process.env.DB_TEST || ":memory:",
    dropSchema: false,
    synchronize: true,
    logging: false,
  },
  production: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
    database: process.env.DB_DATABASE,
    host: process.env.DB_HOST,
    type: process.env.DB_TYPE || "postgres",
  },
};
