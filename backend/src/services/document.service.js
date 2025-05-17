const { logger } = require('../utils/logger');
const { db } = require('../config/database');
const { ValidationError } = require('../utils/errors');

class DocumentService {
  static async list({ page, limit, folder, status, type }) {
    const offset = (page - 1) * limit;
    let listQuery = 'SELECT * FROM documents WHERE deleted_at IS NULL';
    const params = [];
    
    if (folder) {
      listQuery += ' AND folder_id = $' + (params.length + 1);
      params.push(folder);
    }
    
    if (status) {
      listQuery += ' AND status = $' + (params.length + 1);
      params.push(status);
    }
    
    if (type) {
      listQuery += ' AND type = $' + (params.length + 1);
      params.push(type);
    }
    
    listQuery += ' ORDER BY created_at DESC LIMIT $' + (params.length + 1) + ' OFFSET $' + (params.length + 2);
    params.push(limit, offset);
    
    const countQuery = listQuery.replace('SELECT *', 'SELECT COUNT(*)').split('LIMIT')[0];
    
    const [documents, countResult] = await Promise.all([
      db.query(listQuery, params),
      db.query(countQuery, params.slice(0, -2))
    ]);
    
    return {
      documents: documents.rows,
      total: parseInt(countResult.rows[0].count),
      page,
      totalPages: Math.ceil(parseInt(countResult.rows[0].count) / limit)
    };
  }

  static async getById(id) {
    const result = await db.query(
      'SELECT * FROM documents WHERE id = $1 AND deleted_at IS NULL',
      [id]
    );
    return result.rows[0];
  }

  static async create(documentData) {
    this.validateDocumentData(documentData);

    const {
      code,
      title,
      folderId,
      status,
      type,
      filePath,
      uploadedBy,
      mimeType,
      size,
      metadata
    } = documentData;

    const result = await db.query(
      `INSERT INTO documents (
        code, title, folder_id, status, type, file_path,
        uploaded_by, mime_type, size, metadata, created_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, NOW())
      RETURNING *`,
      [code, title, folderId, status, type, filePath, uploadedBy, mimeType, size, metadata]
    );

    return result.rows[0];
  }

  static async update(id, updateData) {
    const document = await this.getById(id);
    if (!document) {
      return null;
    }

    const allowedUpdates = [
      'title',
      'status',
      'metadata'
    ];

    const updates = [];
    const values = [];
    let paramCount = 1;

    for (const [key, value] of Object.entries(updateData)) {
      if (allowedUpdates.includes(key)) {
        updates.push(`${key} = $${paramCount}`);
        values.push(value);
        paramCount++;
      }
    }

    if (updates.length === 0) {
      return document;
    }

    values.push(id);
    const updateQuery = `
      UPDATE documents 
      SET ${updates.join(', ')}, 
          updated_at = NOW()
      WHERE id = $${paramCount}
      RETURNING *
    `;

    const result = await db.query(updateQuery, values);
    return result.rows[0];
  }

  static async createVersion(versionData) {
    const {
      documentId,
      filePath,
      uploadedBy,
      mimeType,
      size,
      metadata
    } = versionData;

    const result = await db.query(
      `INSERT INTO document_versions (
        document_id, file_path, uploaded_by, mime_type,
        size, metadata, created_at
      ) VALUES ($1, $2, $3, $4, $5, $6, NOW())
      RETURNING *`,
      [documentId, filePath, uploadedBy, mimeType, size, metadata]
    );

    return result.rows[0];
  }

  static async listVersions(documentId) {
    const result = await db.query(
      'SELECT * FROM document_versions WHERE document_id = $1 ORDER BY created_at DESC',
      [documentId]
    );
    return result.rows;
  }

  static async delete(id) {
    await db.query(
      'UPDATE documents SET deleted_at = NOW() WHERE id = $1',
      [id]
    );
  }

  static async search(params) {
    const {
      textQuery,
      startDate,
      endDate,
      metadata = {},
      page = 1,
      limit = 10
    } = params;

    const conditions = ['deleted_at IS NULL'];
    const values = [];
    let paramCount = 1;

    if (textQuery) {
      conditions.push(`(
        title ILIKE $${paramCount} OR
        code ILIKE $${paramCount} OR
        metadata::text ILIKE $${paramCount}
      )`);
      values.push(`%${textQuery}%`);
      paramCount++;
    }

    if (startDate) {
      conditions.push(`created_at >= $${paramCount}`);
      values.push(startDate);
      paramCount++;
    }

    if (endDate) {
      conditions.push(`created_at <= $${paramCount}`);
      values.push(endDate);
      paramCount++;
    }

    // Busca em campos específicos dos metadados
    for (const [key, value] of Object.entries(metadata)) {
      conditions.push(`metadata->>'${key}' = $${paramCount}`);
      values.push(value);
      paramCount++;
    }

    const offset = (page - 1) * limit;
    const documentSearchQuery = `
      SELECT * FROM documents
      WHERE ${conditions.join(' AND ')}
      ORDER BY created_at DESC
      LIMIT $${paramCount} OFFSET $${paramCount + 1}
    `;
    values.push(limit, offset);

    const countQuery = `
      SELECT COUNT(*) FROM documents
      WHERE ${conditions.join(' AND ')}
    `;

    const [documents, countResult] = await Promise.all([
      db.query(documentSearchQuery, values),
      db.query(countQuery, values.slice(0, -2))
    ]);

    return {
      documents: documents.rows,
      total: parseInt(countResult.rows[0].count),
      page,
      totalPages: Math.ceil(parseInt(countResult.rows[0].count) / limit)
    };
  }

  static validateDocumentData(data) {
    const requiredFields = ['code', 'title', 'folderId', 'status', 'type'];
    const missingFields = requiredFields.filter(field => !data[field]);
    
    if (missingFields.length > 0) {
      throw new ValidationError(`Campos obrigatórios ausentes: ${missingFields.join(', ')}`);
    }
    
    // Validações específicas
    if (data.code && !/^[\w-]+$/.test(data.code)) {
      throw new ValidationError('Código inválido. Use apenas letras, números, hífens e underscores.');
    }
    
    if (data.title && data.title.length > 255) {
      throw new ValidationError('Título muito longo. Máximo de 255 caracteres.');
    }
  }
}

module.exports = DocumentService; 