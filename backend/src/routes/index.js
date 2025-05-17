const documentRoutes = require('./document.routes');
const authRoutes = require('./auth.routes');
const userRoutes = require('./user.routes');
const folderRoutes = require('./folder.routes');

function setupRoutes(app) {
  app.use('/api/documents', documentRoutes);
  app.use('/api/auth', authRoutes);
  app.use('/api/users', userRoutes);
  app.use('/api/folders', folderRoutes);
  
  // Rota de healthcheck
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });
}

module.exports = { setupRoutes }; 