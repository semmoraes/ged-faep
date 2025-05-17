const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const { upload } = require('../middleware/upload');
const DocumentController = require('../controllers/document.controller');

// Listar documentos (com paginação e filtros)
router.get('/', auth, DocumentController.listDocuments);

// Buscar documento por ID
router.get('/:id', auth, DocumentController.getDocument);

// Upload de novo documento
router.post('/', 
  auth, 
  upload.single('file'),
  DocumentController.uploadDocument
);

// Atualizar metadados do documento
router.put('/:id', 
  auth, 
  DocumentController.updateDocument
);

// Criar nova versão do documento
router.post('/:id/versions',
  auth,
  upload.single('file'),
  DocumentController.createVersion
);

// Listar versões do documento
router.get('/:id/versions',
  auth,
  DocumentController.listVersions
);

// Excluir documento (soft delete)
router.delete('/:id',
  auth,
  DocumentController.deleteDocument
);

// Busca avançada
router.post('/search',
  auth,
  DocumentController.searchDocuments
);

module.exports = router; 