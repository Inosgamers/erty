const { Transaction, Account, Category } = require('../models');
const { AppError } = require('../middleware/errorHandler');
const { Op } = require('sequelize');
const moment = require('moment');

exports.getTransactions = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 50,
      type,
      categoryId,
      accountId,
      startDate,
      endDate,
      search
    } = req.query;

    const offset = (page - 1) * limit;
    const where = { userId: req.user.id };

    // Filters
    if (type) where.type = type;
    if (categoryId) where.categoryId = categoryId;
    if (accountId) where.accountId = accountId;

    if (startDate && endDate) {
      where.date = {
        [Op.between]: [new Date(startDate), new Date(endDate)]
      };
    }

    if (search) {
      where.description = {
        [Op.iLike]: `%${search}%`
      };
    }

    const { count, rows } = await Transaction.findAndCountAll({
      where,
      limit: parseInt(limit),
      offset,
      order: [['date', 'DESC']],
      include: [
        { model: Account, as: 'account', attributes: ['id', 'name', 'type'] },
        { model: Category, as: 'category', attributes: ['id', 'name', 'icon', 'color'] },
        { model: Account, as: 'toAccount', attributes: ['id', 'name'] }
      ]
    });

    res.status(200).json({
      success: true,
      data: {
        transactions: rows,
        pagination: {
          total: count,
          page: parseInt(page),
          pages: Math.ceil(count / limit)
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

exports.getTransaction = async (req, res, next) => {
  try {
    const transaction = await Transaction.findOne({
      where: {
        id: req.params.id,
        userId: req.user.id
      },
      include: [
        { model: Account, as: 'account' },
        { model: Category, as: 'category' },
        { model: Account, as: 'toAccount' }
      ]
    });

    if (!transaction) {
      return next(new AppError('Transação não encontrada', 404));
    }

    res.status(200).json({
      success: true,
      data: transaction
    });
  } catch (error) {
    next(error);
  }
};

exports.createTransaction = async (req, res, next) => {
  try {
    const {
      accountId,
      categoryId,
      type,
      amount,
      description,
      date,
      paymentMethod,
      toAccountId,
      tags,
      notes
    } = req.body;

    // Verify account ownership
    const account = await Account.findOne({
      where: { id: accountId, userId: req.user.id }
    });

    if (!account) {
      return next(new AppError('Conta não encontrada', 404));
    }

    // Create transaction
    const transaction = await Transaction.create({
      userId: req.user.id,
      accountId,
      categoryId,
      type,
      amount,
      description,
      date: date || new Date(),
      paymentMethod,
      toAccountId,
      tags,
      notes,
      isSynced: true,
      syncedAt: new Date()
    });

    // Update account balance
    let newBalance = parseFloat(account.currentBalance);
    
    if (type === 'expense') {
      newBalance -= parseFloat(amount);
    } else if (type === 'income') {
      newBalance += parseFloat(amount);
    } else if (type === 'transfer' && toAccountId) {
      newBalance -= parseFloat(amount);
      
      // Update destination account
      const toAccount = await Account.findByPk(toAccountId);
      if (toAccount) {
        await toAccount.update({
          currentBalance: parseFloat(toAccount.currentBalance) + parseFloat(amount)
        });
      }
    }

    await account.update({ currentBalance: newBalance });

    res.status(201).json({
      success: true,
      message: 'Transação criada com sucesso',
      data: transaction
    });
  } catch (error) {
    next(error);
  }
};

exports.updateTransaction = async (req, res, next) => {
  try {
    const transaction = await Transaction.findOne({
      where: {
        id: req.params.id,
        userId: req.user.id
      }
    });

    if (!transaction) {
      return next(new AppError('Transação não encontrada', 404));
    }

    // Revert old balance changes
    const account = await Account.findByPk(transaction.accountId);
    let newBalance = parseFloat(account.currentBalance);

    if (transaction.type === 'expense') {
      newBalance += parseFloat(transaction.amount);
    } else if (transaction.type === 'income') {
      newBalance -= parseFloat(transaction.amount);
    }

    // Update transaction
    const updated = await transaction.update(req.body);

    // Apply new balance changes
    if (updated.type === 'expense') {
      newBalance -= parseFloat(updated.amount);
    } else if (updated.type === 'income') {
      newBalance += parseFloat(updated.amount);
    }

    await account.update({ currentBalance: newBalance });

    res.status(200).json({
      success: true,
      message: 'Transação atualizada com sucesso',
      data: updated
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteTransaction = async (req, res, next) => {
  try {
    const transaction = await Transaction.findOne({
      where: {
        id: req.params.id,
        userId: req.user.id
      }
    });

    if (!transaction) {
      return next(new AppError('Transação não encontrada', 404));
    }

    // Revert balance changes
    const account = await Account.findByPk(transaction.accountId);
    let newBalance = parseFloat(account.currentBalance);

    if (transaction.type === 'expense') {
      newBalance += parseFloat(transaction.amount);
    } else if (transaction.type === 'income') {
      newBalance -= parseFloat(transaction.amount);
    }

    await account.update({ currentBalance: newBalance });
    await transaction.destroy();

    res.status(200).json({
      success: true,
      message: 'Transação deletada com sucesso'
    });
  } catch (error) {
    next(error);
  }
};

exports.getStatistics = async (req, res, next) => {
  try {
    const { startDate, endDate } = req.query;
    const where = { 
      userId: req.user.id,
      status: 'completed'
    };

    if (startDate && endDate) {
      where.date = {
        [Op.between]: [new Date(startDate), new Date(endDate)]
      };
    } else {
      // Default to current month
      where.date = {
        [Op.between]: [
          moment().startOf('month').toDate(),
          moment().endOf('month').toDate()
        ]
      };
    }

    const transactions = await Transaction.findAll({
      where,
      attributes: ['type', 'amount', 'categoryId'],
      include: [
        { model: Category, as: 'category', attributes: ['name', 'color', 'icon'] }
      ]
    });

    const income = transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + parseFloat(t.amount), 0);

    const expenses = transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + parseFloat(t.amount), 0);

    const balance = income - expenses;

    // Group by category
    const byCategory = {};
    transactions.forEach(t => {
      if (t.category) {
        const catName = t.category.name;
        if (!byCategory[catName]) {
          byCategory[catName] = {
            name: catName,
            color: t.category.color,
            icon: t.category.icon,
            total: 0,
            count: 0
          };
        }
        byCategory[catName].total += parseFloat(t.amount);
        byCategory[catName].count += 1;
      }
    });

    res.status(200).json({
      success: true,
      data: {
        summary: {
          income,
          expenses,
          balance,
          transactions: transactions.length
        },
        byCategory: Object.values(byCategory).sort((a, b) => b.total - a.total)
      }
    });
  } catch (error) {
    next(error);
  }
};
