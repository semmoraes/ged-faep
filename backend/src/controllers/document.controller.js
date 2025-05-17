const { logger } = require('../utils/logger');
const DocumentService = require('../services/document.service');

class DocumentController {
  static async listDocuments(req, res) {
    try {
      const { page = 1, limit = 10, folder, status, type } = req.query;
      const documents = await DocumentService.list({
        page: parseInt(page),
        limit: parseInt(limit),
        folder,
        status,
        type
      });
      
      res.json(documents);
    } catch (error) {
      logger.error('Erro ao listar documentos:', error);
      res.status(500).json({ error: 'Erro ao listar documentos' });
    }
  }

  static async getDocument(req, res) {
    try {
      const { id } = req.params;
      const document = await DocumentService.getById(id);
      
      if (!document) {
        return res.status(404).json({ error: 'Documento não encontrado' });
      }
      
      res.json(document);
    } catch (error) {
      logger.error(`Erro ao buscar documento ${req.params.id}:`, error);
      res.status(500).json({ error: 'Erro ao buscar documento' });
    }
  }

  static async uploadDocument(req, res) {
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'Nenhum arquivo enviado' });
      }

      const documentData = {
        ...req.body,
        filePath: req.file.path,
        uploadedBy: req.user.id,
        mimeType: req.file.mimetype,
        size: req.file.size
      };

      const document = await DocumentService.create(documentData);
      res.status(201).json(document);
    } catch (error) {
      logger.error('Erro ao fazer upload de documento:', error);
      res.status(500).json({ error: 'Erro ao fazer upload de documento' });
    }
  }

  static async updateDocument(req, res) {
    try {
      const { id } = req.params;
      const updateData = req.body;
      
      const document = await DocumentService.update(id, updateData);
      
      if (!document) {
        return res.status(404).json({ error: 'Documento não encontrado' });
      }
      
      res.json(document);
    } catch (error) {
      logger.error(`Erro ao atualizar documento ${req.params.id}:`, error);
      res.status(500).json({ error: 'Erro ao atualizar documento' });
    }
  }

  static async createVersion(req, res) {
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'Nenhum arquivo enviado' });
      }

      const { id } = req.params;
      const versionData = {
        ...req.body,
        documentId: id,
        filePath: req.file.path,
        uploadedBy: req.user.id,
        mimeType: req.file.mimetype,
        size: req.file.size
      };

      const version = await DocumentService.createVersion(versionData);
      res.status(201).json(version);
    } catch (error) {
      logger.error(`Erro ao criar versão do documento ${req.params.id}:`, error);
      res.status(500).json({ error: 'Erro ao criar versão do documento' });
    }
  }

  static async listVersions(req, res) {
    try {
      const { id } = req.params;
      const versions = await DocumentService.listVersions(id);
      res.json(versions);
    } catch (error) {
      logger.error(`Erro ao listar versões do documento ${req.params.id}:`, error);
      res.status(500).json({ error: 'Erro ao listar versões do documento' });
    }
  }

  static async deleteDocument(req, res) {
    try {
      const { id } = req.params;
      await DocumentService.delete(id);
      res.status(204).send();
    } catch (error) {
      logger.error(`Erro ao excluir documento ${req.params.id}:`, error);
      res.status(500).json({ error: 'Erro ao excluir documento' });
    }
  }

  static async searchDocuments(req, res) {
    try {
      const searchParams = req.body;
      const results = await DocumentService.search(searchParams);
      res.json(results);
    } catch (error) {
      logger.error('Erro na busca avançada:', error);
      res.status(500).json({ error: 'Erro na busca avançada' });
    }
  }
}

module.exports = DocumentController; 