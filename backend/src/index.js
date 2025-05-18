const path = require('path');
if (process.env.NODE_ENV !== 'production') {
  // Para backend/src/index.js, o .env está em ../../.env se na raiz do projeto, ou ../.env se na raiz de backend/
  // Vamos assumir que o .env local que queremos carregar está em backend/.env
  require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
}

const express = require('express');
const cors = require('cors');
const { setupRoutes } = require('./routes');
const { setupMiddleware } = require('./middleware');
const { logger } = require('./utils/logger');

const app = express();
const port = process.env.PORT || 3000;

// Middleware básico
app.use(cors());
app.use(express.json());

// Setup de rotas e middleware personalizado
setupMiddleware(app);
setupRoutes(app);

// Tratamento de erros global
app.use((err, req, res, next) => {
  logger.error(err.stack);
  res.status(500).json({
    error: 'Erro interno do servidor',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

app.listen(port, () => {
  logger.info(`Servidor GED FAEP rodando na porta ${port}`);
}); 