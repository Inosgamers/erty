const express = require('express');
const router = express.Router();
const { body, query } = require('express-validator');
const aiController = require('../controllers/aiController');
const { protect, checkPremium } = require('../middleware/auth');
const validate = require('../middleware/validator');

router.use(protect);

// Free tier
router.get('/recommendations', aiController.getRecommendations);

// Premium features
router.get('/insights',
  checkPremium,
  [query('months').optional().isInt({ min: 1, max: 12 })],
  validate,
  aiController.getInsights
);

router.get('/predict',
  checkPremium,
  [query('months').optional().isInt({ min: 1, max: 12 })],
  validate,
  aiController.predictExpenses
);

router.get('/suggest-budget',
  checkPremium,
  aiController.suggestBudget
);

router.post('/categorize',
  [
    body('description').trim().notEmpty().withMessage('Descrição é obrigatória'),
    body('amount').optional().isDecimal()
  ],
  validate,
  aiController.categorizeTransaction
);

module.exports = router;
