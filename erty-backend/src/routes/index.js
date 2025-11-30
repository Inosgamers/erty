const express = require('express');
const router = express.Router();

// Import routes
const authRoutes = require('./authRoutes');
const accountRoutes = require('./accountRoutes');
const transactionRoutes = require('./transactionRoutes');
const budgetRoutes = require('./budgetRoutes');
const goalRoutes = require('./goalRoutes');
const syncRoutes = require('./syncRoutes');
const aiRoutes = require('./aiRoutes');

// Mount routes
router.use('/auth', authRoutes);
router.use('/accounts', accountRoutes);
router.use('/transactions', transactionRoutes);
router.use('/budgets', budgetRoutes);
router.use('/goals', goalRoutes);
router.use('/sync', syncRoutes);
router.use('/ai', aiRoutes);

// API info
router.get('/', (req, res) => {
  res.json({
    name: 'Erty API',
    version: '1.0.0',
    description: 'API para gestão financeira pessoal e familiar',
    endpoints: {
      auth: '/auth',
      accounts: '/accounts',
      transactions: '/transactions',
      budgets: '/budgets',
      goals: '/goals',
      sync: '/sync',
      ai: '/ai'
    }
  });
});

module.exports = router;
