const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const goalController = require('../controllers/goalController');
const { protect } = require('../middleware/auth');
const validate = require('../middleware/validator');

router.use(protect);

router.get('/', goalController.getGoals);
router.get('/:id', goalController.getGoal);

router.post('/',
  [
    body('name').trim().notEmpty().withMessage('Nome é obrigatório'),
    body('targetAmount').isDecimal().withMessage('Valor da meta inválido'),
    body('targetDate').isISO8601().withMessage('Data da meta inválida'),
    body('category').optional().isIn(['emergency_fund', 'vacation', 'house', 'car', 'education', 'retirement', 'debt_payment', 'other'])
  ],
  validate,
  goalController.createGoal
);

router.patch('/:id', goalController.updateGoal);
router.post('/:id/contribute',
  [body('amount').isDecimal().withMessage('Valor inválido')],
  validate,
  goalController.contributeToGoal
);
router.delete('/:id', goalController.deleteGoal);

module.exports = router;
