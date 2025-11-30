const syncService = require('../services/syncService');
const { AppError } = require('../middleware/errorHandler');

exports.syncTransactions = async (req, res, next) => {
  try {
    const { transactions } = req.body;

    if (!Array.isArray(transactions)) {
      return next(new AppError('Formato inválido: esperado array de transações', 400));
    }

    // Validate sync data
    const validation = syncService.validateSyncData(transactions);
    if (!validation.valid) {
      return next(new AppError(`Dados inválidos: ${validation.errors.join(', ')}`, 400));
    }

    // Perform sync
    const results = await syncService.syncTransactions(req.user, transactions);

    res.status(200).json({
      success: true,
      message: 'Sincronização concluída',
      data: results
    });
  } catch (error) {
    next(error);
  }
};

exports.getUpdates = async (req, res, next) => {
  try {
    const { lastSyncTime } = req.query;

    if (!lastSyncTime) {
      return next(new AppError('lastSyncTime é obrigatório', 400));
    }

    const updates = await syncService.getUpdates(req.user, lastSyncTime);

    res.status(200).json({
      success: true,
      data: updates
    });
  } catch (error) {
    next(error);
  }
};
