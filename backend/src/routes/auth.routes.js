const express = require('express');
const router = express.Router();

// TODO: Implementar rotas de autenticação (ex: /login, /register, /refresh-token)

// Exemplo de rota GET básica
router.get('/', (req, res) => {
  res.status(200).json({ message: 'Auth routes placeholder - GET /api/auth' });
});

// Exemplo de rota POST básica para login (apenas placeholder)
router.post('/login', (req, res) => {
  // Aqui viria a lógica de autenticação com AuthController.login
  res.status(501).json({ message: 'Login endpoint not implemented yet.' }); 
});

module.exports = router; 