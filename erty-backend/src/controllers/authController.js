const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { User } = require('../models');
const { AppError } = require('../middleware/errorHandler');
const logger = require('../utils/logger');
const { cacheDel } = require('../config/redis');

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d'
  });
};

const signRefreshToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRE || '30d'
  });
};

const createSendToken = (user, statusCode, res, message = 'Sucesso') => {
  const token = signToken(user.id);
  const refreshToken = signRefreshToken(user.id);

  res.status(statusCode).json({
    success: true,
    message,
    data: {
      user,
      token,
      refreshToken
    }
  });
};

exports.register = async (req, res, next) => {
  try {
    const { name, email, password, phone } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return next(new AppError('Email já cadastrado', 400));
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password,
      phone
    });

    logger.info(`Novo usuário registrado: ${email}`);
    createSendToken(user, 201, res, 'Conta criada com sucesso');
  } catch (error) {
    next(error);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Check if email and password exist
    if (!email || !password) {
      return next(new AppError('Por favor, forneça email e senha', 400));
    }

    // Check if user exists
    const user = await User.findOne({ where: { email } });
    if (!user || !(await user.comparePassword(password))) {
      return next(new AppError('Email ou senha incorretos', 401));
    }

    // Check if account is active
    if (user.status !== 'active') {
      return next(new AppError('Conta suspensa ou inativa', 403));
    }

    // Update last login
    await user.update({
      lastLoginAt: new Date(),
      lastLoginIp: req.ip
    });

    logger.info(`Login bem-sucedido: ${email}`);
    createSendToken(user, 200, res, 'Login realizado com sucesso');
  } catch (error) {
    next(error);
  }
};

exports.logout = async (req, res, next) => {
  try {
    // Clear user cache
    await cacheDel(`user:${req.user.id}`);

    res.status(200).json({
      success: true,
      message: 'Logout realizado com sucesso'
    });
  } catch (error) {
    next(error);
  }
};

exports.refreshToken = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return next(new AppError('Refresh token não fornecido', 400));
    }

    // Verify refresh token
    const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET);

    // Get user
    const user = await User.findByPk(decoded.id);
    if (!user) {
      return next(new AppError('Usuário não encontrado', 401));
    }

    // Generate new tokens
    createSendToken(user, 200, res, 'Token renovado com sucesso');
  } catch (error) {
    return next(new AppError('Refresh token inválido ou expirado', 401));
  }
};

exports.getMe = async (req, res, next) => {
  try {
    res.status(200).json({
      success: true,
      data: req.user
    });
  } catch (error) {
    next(error);
  }
};

exports.updateProfile = async (req, res, next) => {
  try {
    const { name, phone, currency, language, timezone } = req.body;

    const updatedUser = await req.user.update({
      name,
      phone,
      currency,
      language,
      timezone
    });

    // Clear cache
    await cacheDel(`user:${req.user.id}`);

    res.status(200).json({
      success: true,
      message: 'Perfil atualizado com sucesso',
      data: updatedUser
    });
  } catch (error) {
    next(error);
  }
};

exports.changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    // Verify current password
    if (!(await req.user.comparePassword(currentPassword))) {
      return next(new AppError('Senha atual incorreta', 401));
    }

    // Update password
    await req.user.update({ password: newPassword });

    // Clear cache
    await cacheDel(`user:${req.user.id}`);

    logger.info(`Senha alterada: ${req.user.email}`);
    res.status(200).json({
      success: true,
      message: 'Senha alterada com sucesso'
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteAccount = async (req, res, next) => {
  try {
    await req.user.update({ status: 'deleted' });
    await cacheDel(`user:${req.user.id}`);

    logger.info(`Conta deletada: ${req.user.email}`);
    res.status(200).json({
      success: true,
      message: 'Conta deletada com sucesso'
    });
  } catch (error) {
    next(error);
  }
};
