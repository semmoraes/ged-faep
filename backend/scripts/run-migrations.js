require('dotenv').config();
const fs = require('fs').promises;
const path = require('path');
const { Pool } = require('pg');
const { logger } = require('../src/utils/logger');

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

async function runMigrations() {
  const client = await pool.connect();
  
  try {
    // Criar tabela de controle de migrações se não existir
    await client.query(`
      CREATE TABLE IF NOT EXISTS migrations (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL UNIQUE,
        executed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Ler arquivos de migração
    const migrationsDir = path.join(__dirname, '..', 'migrations');
    const files = await fs.readdir(migrationsDir);
    const sqlFiles = files.filter(f => f.endsWith('.sql')).sort();

    // Executar cada migração
    for (const file of sqlFiles) {
      const migrationName = path.basename(file);

      // Verificar se a migração já foi executada
      const { rows } = await client.query(
        'SELECT id FROM migrations WHERE name = $1',
        [migrationName]
      );

      if (rows.length === 0) {
        logger.info(`Executando migração: ${migrationName}`);

        // Ler e executar o arquivo SQL
        const filePath = path.join(migrationsDir, file);
        const sql = await fs.readFile(filePath, 'utf8');

        await client.query('BEGIN');
        try {
          await client.query(sql);
          await client.query(
            'INSERT INTO migrations (name) VALUES ($1)',
            [migrationName]
          );
          await client.query('COMMIT');
          logger.info(`Migração ${migrationName} executada com sucesso`);
        } catch (error) {
          await client.query('ROLLBACK');
          throw error;
        }
      } else {
        logger.info(`Migração ${migrationName} já foi executada anteriormente`);
      }
    }

    logger.info('Todas as migrações foram executadas com sucesso');
  } catch (error) {
    logger.error('Erro ao executar migrações:', error);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

// Executar migrações
runMigrations().catch(error => {
  logger.error('Erro fatal ao executar migrações:', error);
  process.exit(1);
}); 