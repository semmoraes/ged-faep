// backend/src/middleware/index.js

// Importe seus middlewares aqui, se necessário
// Exemplo: const { loggerMiddleware } = require('./logger');

function setupMiddleware(app) {
  // Configure seus middlewares globais aqui
  // Exemplo: app.use(loggerMiddleware);
  console.log('Função setupMiddleware chamada - TODO: Implementar configuração de middleware global');
}

module.exports = {
  setupMiddleware,
  // Exporte outros middlewares individualmente se precisar deles em outros lugares
  // auth: require('./auth').auth, // Exemplo se você quiser re-exportar
  // checkRole: require('./auth').checkRole // Exemplo
}; 