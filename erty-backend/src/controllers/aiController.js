const aiService = require('../services/aiService');
const { AppError } = require('../middleware/errorHandler');

exports.getInsights = async (req, res, next) => {
  try {
    const { months = 3 } = req.query;

    const insights = await aiService.analyzeSpendingPatterns(
      req.user.id,
      parseInt(months)
    );

    res.status(200).json({
      success: true,
      data: insights
    });
  } catch (error) {
    next(error);
  }
};

exports.getRecommendations = async (req, res, next) => {
  try {
    const insights = await aiService.analyzeSpendingPatterns(req.user.id, 3);

    res.status(200).json({
      success: true,
      data: {
        recommendations: insights.recommendations
      }
    });
  } catch (error) {
    next(error);
  }
};

exports.predictExpenses = async (req, res, next) => {
  try {
    const { months = 3 } = req.query;

    const prediction = await aiService.predictFutureExpenses(
      req.user.id,
      parseInt(months)
    );

    res.status(200).json({
      success: true,
      data: prediction
    });
  } catch (error) {
    next(error);
  }
};

exports.suggestBudget = async (req, res, next) => {
  try {
    const suggestions = await aiService.suggestBudget(req.user.id);

    res.status(200).json({
      success: true,
      data: suggestions
    });
  } catch (error) {
    next(error);
  }
};

exports.categorizeTransaction = async (req, res, next) => {
  try {
    const { description, amount } = req.body;

    if (!description) {
      return next(new AppError('Descrição é obrigatória', 400));
    }

    const result = await aiService.autoCategorizeTransaction(description, amount);

    res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    next(error);
  }
};
