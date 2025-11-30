const { Goal, Account } = require('../models');
const { AppError } = require('../middleware/errorHandler');

exports.getGoals = async (req, res, next) => {
  try {
    const goals = await Goal.findAll({
      where: { userId: req.user.id, isActive: true },
      include: [
        { model: Account, as: 'linkedAccount', attributes: ['name', 'currentBalance'] }
      ],
      order: [['priority', 'DESC'], ['targetDate', 'ASC']]
    });

    res.status(200).json({
      success: true,
      data: goals
    });
  } catch (error) {
    next(error);
  }
};

exports.getGoal = async (req, res, next) => {
  try {
    const goal = await Goal.findOne({
      where: {
        id: req.params.id,
        userId: req.user.id
      },
      include: [
        { model: Account, as: 'linkedAccount' }
      ]
    });

    if (!goal) {
      return next(new AppError('Meta não encontrada', 404));
    }

    res.status(200).json({
      success: true,
      data: goal
    });
  } catch (error) {
    next(error);
  }
};

exports.createGoal = async (req, res, next) => {
  try {
    const {
      name,
      description,
      targetAmount,
      targetDate,
      category,
      priority,
      linkedAccountId
    } = req.body;

    const goal = await Goal.create({
      userId: req.user.id,
      name,
      description,
      targetAmount,
      targetDate,
      category,
      priority,
      linkedAccountId,
      currency: req.user.currency
    });

    res.status(201).json({
      success: true,
      message: 'Meta criada com sucesso',
      data: goal
    });
  } catch (error) {
    next(error);
  }
};

exports.updateGoal = async (req, res, next) => {
  try {
    const goal = await Goal.findOne({
      where: {
        id: req.params.id,
        userId: req.user.id
      }
    });

    if (!goal) {
      return next(new AppError('Meta não encontrada', 404));
    }

    const updated = await goal.update(req.body);

    // Check if goal is completed
    if (updated.currentAmount >= updated.targetAmount && !updated.isCompleted) {
      await updated.update({
        isCompleted: true,
        completedAt: new Date()
      });
    }

    res.status(200).json({
      success: true,
      message: 'Meta atualizada com sucesso',
      data: updated
    });
  } catch (error) {
    next(error);
  }
};

exports.contributeToGoal = async (req, res, next) => {
  try {
    const { amount } = req.body;

    const goal = await Goal.findOne({
      where: {
        id: req.params.id,
        userId: req.user.id
      }
    });

    if (!goal) {
      return next(new AppError('Meta não encontrada', 404));
    }

    const newAmount = parseFloat(goal.currentAmount) + parseFloat(amount);
    await goal.update({ currentAmount: newAmount });

    // Check if goal is completed
    if (newAmount >= goal.targetAmount) {
      await goal.update({
        isCompleted: true,
        completedAt: new Date()
      });
    }

    res.status(200).json({
      success: true,
      message: 'Contribuição adicionada com sucesso',
      data: goal
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteGoal = async (req, res, next) => {
  try {
    const goal = await Goal.findOne({
      where: {
        id: req.params.id,
        userId: req.user.id
      }
    });

    if (!goal) {
      return next(new AppError('Meta não encontrada', 404));
    }

    await goal.update({ isActive: false });

    res.status(200).json({
      success: true,
      message: 'Meta deletada com sucesso'
    });
  } catch (error) {
    next(error);
  }
};
