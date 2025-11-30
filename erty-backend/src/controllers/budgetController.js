const { Budget, Category, Transaction } = require('../models');
const { AppError } = require('../middleware/errorHandler');
const { Op } = require('sequelize');
const moment = require('moment');

exports.getBudgets = async (req, res, next) => {
  try {
    const budgets = await Budget.findAll({
      where: { userId: req.user.id, isActive: true },
      include: [
        { model: Category, as: 'category', attributes: ['name', 'icon', 'color'] }
      ],
      order: [['createdAt', 'DESC']]
    });

    res.status(200).json({
      success: true,
      data: budgets
    });
  } catch (error) {
    next(error);
  }
};

exports.getBudget = async (req, res, next) => {
  try {
    const budget = await Budget.findOne({
      where: {
        id: req.params.id,
        userId: req.user.id
      },
      include: [
        { model: Category, as: 'category' }
      ]
    });

    if (!budget) {
      return next(new AppError('Orçamento não encontrado', 404));
    }

    // Calculate spent amount for current period
    const spent = await Transaction.sum('amount', {
      where: {
        userId: req.user.id,
        categoryId: budget.categoryId,
        type: 'expense',
        date: {
          [Op.between]: [budget.startDate, budget.endDate]
        }
      }
    });

    budget.spent = spent || 0;
    await budget.save();

    res.status(200).json({
      success: true,
      data: budget
    });
  } catch (error) {
    next(error);
  }
};

exports.createBudget = async (req, res, next) => {
  try {
    const {
      name,
      categoryId,
      amount,
      period,
      startDate,
      endDate,
      alertThreshold
    } = req.body;

    const budget = await Budget.create({
      userId: req.user.id,
      name,
      categoryId,
      amount,
      period,
      startDate: startDate || moment().startOf('month').toDate(),
      endDate: endDate || moment().endOf('month').toDate(),
      alertThreshold: alertThreshold || 80
    });

    res.status(201).json({
      success: true,
      message: 'Orçamento criado com sucesso',
      data: budget
    });
  } catch (error) {
    next(error);
  }
};

exports.updateBudget = async (req, res, next) => {
  try {
    const budget = await Budget.findOne({
      where: {
        id: req.params.id,
        userId: req.user.id
      }
    });

    if (!budget) {
      return next(new AppError('Orçamento não encontrado', 404));
    }

    const updated = await budget.update(req.body);

    res.status(200).json({
      success: true,
      message: 'Orçamento atualizado com sucesso',
      data: updated
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteBudget = async (req, res, next) => {
  try {
    const budget = await Budget.findOne({
      where: {
        id: req.params.id,
        userId: req.user.id
      }
    });

    if (!budget) {
      return next(new AppError('Orçamento não encontrado', 404));
    }

    await budget.update({ isActive: false });

    res.status(200).json({
      success: true,
      message: 'Orçamento deletado com sucesso'
    });
  } catch (error) {
    next(error);
  }
};

exports.checkBudgetAlerts = async (req, res, next) => {
  try {
    const budgets = await Budget.findAll({
      where: {
        userId: req.user.id,
        isActive: true,
        alertSent: false
      }
    });

    const alerts = [];

    for (const budget of budgets) {
      const percentage = (budget.spent / budget.amount) * 100;
      
      if (percentage >= budget.alertThreshold) {
        alerts.push({
          budget: budget.name,
          spent: budget.spent,
          limit: budget.amount,
          percentage: percentage.toFixed(2)
        });

        await budget.update({ alertSent: true });
      }
    }

    res.status(200).json({
      success: true,
      data: alerts
    });
  } catch (error) {
    next(error);
  }
};
