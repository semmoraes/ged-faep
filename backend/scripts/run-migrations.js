const path = require('path');
const fs = require('fs'); // Usar fs síncrono para este teste inicial
const { Pool } = require('pg');
const { logger } = require('../src/utils/logger');

// Log para verificar se .env foi carregado e o valor de DATABASE_URL
console.log('[DEBUG] Script run-migrations.js iniciado');

// Tentativa de leitura manual do .env
const envPath = path.resolve(__dirname, '../.env');
console.log(`[DEBUG] Tentando ler .env de: ${envPath}`);
try {
  const envFileContent = fs.readFileSync(envPath, { encoding: 'utf8' });
  console.log('[DEBUG] Conteúdo do arquivo .env LIDO MANUALMENTE:');
  console.log(envFileContent);
  // Tentativa simples de parsear e definir process.env
  envFileContent.split('\n').forEach(line => {
    const trimmedLine = line.trim();
    if (trimmedLine && !trimmedLine.startsWith('#')) {
      const [key, ...valueParts] = trimmedLine.split('=');
      const value = valueParts.join('=');
      if (key && value) {
        process.env[key.trim()] = value.trim();
        console.log(`[DEBUG MAN] Definido process.env.${key.trim()} (após leitura manual)`);
      }
    }
  });
} catch (err) {
  console.error(`[DEBUG] ERRO ao ler manualmente o arquivo .env de ${envPath}:`, err.message);
}

console.log(`[DEBUG] NODE_ENV (após tentativa manual): ${process.env.NODE_ENV}`);
console.log(`[DEBUG] DATABASE_URL (após tentativa manual e antes de usar): ${process.env.DATABASE_URL}`);

if (!process.env.DATABASE_URL) {
  console.error('[FATAL DEBUG] DATABASE_URL ainda não está definida após tentativa manual! Verifique o arquivo .env e o log de erros de leitura.');
  process.exit(1);
}

// Configuração do Pool usando connectionString e SSL false
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: false
});

async function runMigrations() {
  console.log(`[DEBUG] Dentro de runMigrations, usando connectionString: ${pool.options ? pool.options.connectionString : 'N/A'}`);
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
    const files = await fs.promises.readdir(migrationsDir);
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
        const sql = await fs.promises.readFile(filePath, 'utf8');

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