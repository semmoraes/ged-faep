const { Pool } = require('pg');
const { logger } = require('../utils/logger');

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: parseInt(process.env.DB_PORT || '5432'),
  ssl: process.env.DB_SSL === 'true' ? {
    rejectUnauthorized: false
  } : undefined
});

pool.on('error', (err) => {
  logger.error('Erro inesperado no cliente do PostgreSQL:', err);
});

module.exports = {
  db: {
    query: (text, params) => pool.query(text, params),
    getClient: () => pool.connect()
  }
}; 