const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const syncController = require('../controllers/syncController');
const { protect } = require('../middleware/auth');
const validate = require('../middleware/validator');

router.use(protect);

router.post('/transactions',
  [body('transactions').isArray().withMessage('Transactions deve ser um array')],
  validate,
  syncController.syncTransactions
);

router.get('/updates', syncController.getUpdates);

module.exports = router;
