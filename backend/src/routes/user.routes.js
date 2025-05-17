const express = require('express');
const router = express.Router();
const { auth, checkRole } = require('../middleware/auth'); // Supondo que você tenha middleware de autenticação

// TODO: Implementar rotas CRUD para usuários (ex: criar, listar, buscar por ID, atualizar, deletar)
// TODO: Conectar com o UserController correspondente

// Exemplo: Listar usuários (protegido e apenas para admin)
router.get('/', auth, checkRole(['admin']), (req, res) => {
  // Aqui viria a lógica para buscar usuários com UserController.listUsers
  res.status(501).json({ message: 'List users endpoint not implemented yet.' });
});

// Exemplo: Criar usuário (protegido e apenas para admin)
router.post('/', auth, checkRole(['admin']), (req, res) => {
  // Aqui viria a lógica para criar um usuário com UserController.createUser
  res.status(501).json({ message: 'Create user endpoint not implemented yet.' });
});

module.exports = router; 