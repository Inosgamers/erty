const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const budgetController = require('../controllers/budgetController');
const { protect } = require('../middleware/auth');
const validate = require('../middleware/validator');

router.use(protect);

router.get('/', budgetController.getBudgets);
router.get('/alerts', budgetController.checkBudgetAlerts);
router.get('/:id', budgetController.getBudget);

router.post('/',
  [
    body('name').trim().notEmpty().withMessage('Nome é obrigatório'),
    body('amount').isDecimal().withMessage('Valor inválido'),
    body('period').isIn(['daily', 'weekly', 'monthly', 'yearly']).withMessage('Período inválido'),
    body('categoryId').optional().isUUID()
  ],
  validate,
  budgetController.createBudget
);

router.patch('/:id', budgetController.updateBudget);
router.delete('/:id', budgetController.deleteBudget);

module.exports = router;
