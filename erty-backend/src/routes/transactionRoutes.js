const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const transactionController = require('../controllers/transactionController');
const { protect } = require('../middleware/auth');
const validate = require('../middleware/validator');

router.use(protect);

router.get('/', transactionController.getTransactions);
router.get('/statistics', transactionController.getStatistics);
router.get('/:id', transactionController.getTransaction);

router.post('/',
  [
    body('accountId').isUUID().withMessage('ID da conta inválido'),
    body('categoryId').isUUID().withMessage('ID da categoria inválido'),
    body('type').isIn(['expense', 'income', 'transfer']).withMessage('Tipo inválido'),
    body('amount').isDecimal({ decimal_digits: '1,2' }).withMessage('Valor inválido'),
    body('description').optional().trim(),
    body('date').optional().isISO8601()
  ],
  validate,
  transactionController.createTransaction
);

router.patch('/:id', transactionController.updateTransaction);
router.delete('/:id', transactionController.deleteTransaction);

module.exports = router;
