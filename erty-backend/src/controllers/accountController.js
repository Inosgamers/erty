const { Account } = require('../models');
const { AppError } = require('../middleware/errorHandler');

exports.getAccounts = async (req, res, next) => {
  try {
    const accounts = await Account.findAll({
      where: { userId: req.user.id },
      order: [['isDefault', 'DESC'], ['createdAt', 'ASC']]
    });

    const totalBalance = accounts.reduce((sum, acc) => {
      if (acc.includeInTotal) {
        return sum + parseFloat(acc.currentBalance);
      }
      return sum;
    }, 0);

    res.status(200).json({
      success: true,
      data: {
        accounts,
        totalBalance
      }
    });
  } catch (error) {
    next(error);
  }
};

exports.getAccount = async (req, res, next) => {
  try {
    const account = await Account.findOne({
      where: {
        id: req.params.id,
        userId: req.user.id
      }
    });

    if (!account) {
      return next(new AppError('Conta não encontrada', 404));
    }

    res.status(200).json({
      success: true,
      data: account
    });
  } catch (error) {
    next(error);
  }
};

exports.createAccount = async (req, res, next) => {
  try {
    const {
      name,
      type,
      currency,
      initialBalance,
      institution,
      accountNumber,
      color,
      icon
    } = req.body;

    const account = await Account.create({
      userId: req.user.id,
      name,
      type,
      currency: currency || req.user.currency,
      initialBalance: initialBalance || 0,
      currentBalance: initialBalance || 0,
      institution,
      accountNumber,
      color,
      icon
    });

    res.status(201).json({
      success: true,
      message: 'Conta criada com sucesso',
      data: account
    });
  } catch (error) {
    next(error);
  }
};

exports.updateAccount = async (req, res, next) => {
  try {
    const account = await Account.findOne({
      where: {
        id: req.params.id,
        userId: req.user.id
      }
    });

    if (!account) {
      return next(new AppError('Conta não encontrada', 404));
    }

    const updated = await account.update(req.body);

    res.status(200).json({
      success: true,
      message: 'Conta atualizada com sucesso',
      data: updated
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteAccount = async (req, res, next) => {
  try {
    const account = await Account.findOne({
      where: {
        id: req.params.id,
        userId: req.user.id
      }
    });

    if (!account) {
      return next(new AppError('Conta não encontrada', 404));
    }

    await account.update({ status: 'archived' });

    res.status(200).json({
      success: true,
      message: 'Conta arquivada com sucesso'
    });
  } catch (error) {
    next(error);
  }
};
