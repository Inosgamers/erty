const jwt = require('jsonwebtoken');
const { User } = require('../models');
const { AppError } = require('./errorHandler');
const { cacheGet, cacheSet } = require('../config/redis');

const protect = async (req, res, next) => {
  try {
    let token;

    // Get token from header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return next(new AppError('Não autenticado. Por favor, faça login', 401));
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Check cache first
    let user = await cacheGet(`user:${decoded.id}`);

    if (!user) {
      // Get user from database
      user = await User.findByPk(decoded.id);

      if (!user) {
        return next(new AppError('Usuário não encontrado', 401));
      }

      // Cache user
      await cacheSet(`user:${decoded.id}`, user, 3600);
    }

    // Check if user is active
    if (user.status !== 'active') {
      return next(new AppError('Conta suspensa ou inativa', 403));
    }

    // Grant access
    req.user = user;
    next();
  } catch (error) {
    return next(new AppError('Token inválido', 401));
  }
};

const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(new AppError('Você não tem permissão para realizar esta ação', 403));
    }
    next();
  };
};

const checkPremium = async (req, res, next) => {
  if (!req.user.isPremium) {
    return next(new AppError('Esta funcionalidade requer assinatura Premium', 403));
  }

  // Check if premium is still valid
  if (req.user.premiumUntil && new Date(req.user.premiumUntil) < new Date()) {
    await req.user.update({ isPremium: false });
    return next(new AppError('Sua assinatura Premium expirou', 403));
  }

  next();
};

module.exports = { protect, restrictTo, checkPremium };
