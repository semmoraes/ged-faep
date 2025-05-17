require('dotenv').config();
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