require('dotenv').config();

module.exports = {
  development: {
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST || '127.0.0.1',
    port: process.env.DB_PORT || 3306,
    dialect: 'mysql',
    logging: false,
    define: { underscored: true }
  },
  test: {
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: 'polls_test',
    host: process.env.DB_HOST || '127.0.0.1',
    port: process.env.DB_PORT || 3306,
    dialect: 'mysql',
    logging: false,
    define: { underscored: true }
  },
  production: {
    use_env_variable: 'DATABASE_URL', // e.g. mysql://user:pass@host:3306/db
    dialect: 'mysql',
    logging: false,
    define: { underscored: true }
  }
};