const path = require('path');
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });
}

const { Pool } = require('pg');
const { logger } = require('../utils/logger');

const isProduction = process.env.NODE_ENV === 'production';

const poolConfig = {
  connectionString: process.env.DATABASE_URL,
};

if (isProduction) {
  logger.info('[DB_CONFIG] Configurando SSL para ambiente de produção.');
  poolConfig.ssl = {
    rejectUnauthorized: false
  };
} else {
  logger.info('[DB_CONFIG] SSL não configurado para ambiente de não-produção (desenvolvimento).');
  poolConfig.ssl = false;
}

if (!process.env.DATABASE_URL) {
  logger.error('[DB_CONFIG_ERROR] FATAL: DATABASE_URL não está definida no ambiente! Verifique o arquivo .env e as variáveis de ambiente da plataforma.');
} else {
  logger.info(`[DB_CONFIG] DATABASE_URL carregada. Tentando conectar com SSL: ${poolConfig.ssl ? (poolConfig.ssl.rejectUnauthorized === false ? '{rejectUnauthorized:false}' : 'true') : 'false'}`);
}

const pool = new Pool(poolConfig);

pool.on('connect', () => {
  logger.info('[DB_POOL] Cliente conectado ao banco de dados.');
});

pool.on('error', (err) => {
  logger.error('[DB_POOL_ERROR] Erro inesperado no cliente do PostgreSQL:', err);
});

module.exports = {
  db: {
    query: (text, params) => pool.query(text, params),
    getClient: () => pool.connect()
  }
}; 