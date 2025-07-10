const dotenv = require('dotenv');
dotenv.config();

const config = {
  development: {
    port: process.env.PORT || 3000,
    host: process.env.HOST || 'localhost',
    database: {
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 5432,
      database: process.env.DB_NAME,
      username: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASSWORD || 'password',
      dialect: process.env.DB_DIALECT || 'postgres',
      logging: false,
      pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
      }
    },
    jwt: {
      secret: process.env.JWT_ACCESS_TOKEN_SECRET || 'fallback-secret-key',
      refreshSecret: process.env.JWT_API_TOKEN_SECRET || 'fallback-refresh-secret',
      expiresIn: process.env.JWT_EXPIRE || '1h',
      refreshExpiresIn: process.env.JWT_REFRESH_EXPIRE || '7d'
    },
    rateLimit: {
      windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, 
      max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100
    },
    logging: {
      level: process.env.LOG_LEVEL || 'info'
    }
  },
  production: {
    port: process.env.PORT || 3000,
    host: process.env.HOST || '0.0.0.0',
    database: {
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      database: process.env.DB_NAME,
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      dialect: process.env.DB_DIALECT || 'postgres',
      logging: false,
      pool: {
        max: 10,
        min: 2,
        acquire: 30000,
        idle: 10000
      }
    },
    jwt: {
      secret: process.env.JWT_SECRET,
      refreshSecret: process.env.JWT_REFRESH_SECRET,
      expiresIn: process.env.JWT_EXPIRE || '1h',
      refreshExpiresIn: process.env.JWT_REFRESH_EXPIRE || '7d'
    },
    rateLimit: {
      windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
      max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100
    },
    logging: {
      level: process.env.LOG_LEVEL || 'error'
    }
  }
};

const environment = process.env.NODE_ENV || 'development';
module.exports = config[environment];