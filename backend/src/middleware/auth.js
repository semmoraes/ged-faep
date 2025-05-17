const jwt = require('jsonwebtoken');
const { logger } = require('../utils/logger');

const auth = async (req, res, next) => {
  try {
    const authHeader = req.header('Authorization');
    
    if (!authHeader) {
      return res.status(401).json({ error: 'Autenticação necessária' });
    }

    const token = authHeader.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ error: 'Token não fornecido' });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;
      next();
    } catch (error) {
      logger.error('Erro na verificação do token:', error);
      res.status(401).json({ error: 'Token inválido' });
    }
  } catch (error) {
    logger.error('Erro na autenticação:', error);
    res.status(500).json({ error: 'Erro na autenticação' });
  }
};

const checkRole = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Usuário não autenticado' });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Acesso não autorizado' });
    }

    next();
  };
};

module.exports = {
  auth,
  checkRole
}; 