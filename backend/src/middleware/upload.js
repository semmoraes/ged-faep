const multer = require('multer');
const path = require('path');
const crypto = require('crypto');
const { ValidationError } = require('../utils/errors');

// Configuração do armazenamento
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, process.env.UPLOAD_DIR || 'uploads/');
  },
  filename: (req, file, cb) => {
    // Gera um nome único para o arquivo
    crypto.randomBytes(16, (err, raw) => {
      if (err) return cb(err);

      const timestamp = Date.now();
      const originalExt = path.extname(file.originalname);
      cb(null, `${raw.toString('hex')}-${timestamp}${originalExt}`);
    });
  }
});

// Filtro de arquivos permitidos
const fileFilter = (req, file, cb) => {
  const allowedMimes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'text/plain',
    'image/jpeg',
    'image/png',
    'image/gif'
  ];

  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new ValidationError('Tipo de arquivo não permitido.'));
  }
};

// Configuração do Multer
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: process.env.MAX_FILE_SIZE || 10 * 1024 * 1024 // 10MB por padrão
  }
});

module.exports = {
  upload
}; 