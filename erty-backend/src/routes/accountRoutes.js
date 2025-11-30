const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const accountController = require('../controllers/accountController');
const { protect } = require('../middleware/auth');
const validate = require('../middleware/validator');

router.use(protect);

router.get('/', accountController.getAccounts);
router.get('/:id', accountController.getAccount);

router.post('/',
  [
    body('name').trim().notEmpty().withMessage('Nome é obrigatório'),
    body('type').isIn(['checking', 'savings', 'credit', 'investment', 'cash', 'other']).withMessage('Tipo inválido'),
    body('initialBalance').optional().isDecimal().withMessage('Saldo inicial inválido'),
    body('currency').optional().isIn(['AOA', 'USD', 'EUR', 'BRL'])
  ],
  validate,
  accountController.createAccount
);

router.patch('/:id', accountController.updateAccount);
router.delete('/:id', accountController.deleteAccount);

module.exports = router;
