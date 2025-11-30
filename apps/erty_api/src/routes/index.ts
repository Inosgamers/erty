import type { Express } from 'express';
import { Router } from 'express';

import { budgetsRouter } from '../modules/budgets/budgets.router.js';
import { insightsRouter } from '../modules/insights/insights.router.js';
import { transactionsRouter } from '../modules/transactions/transactions.router.js';

export function registerRoutes(app: Express) {
  const router = Router();

  router.get('/health', (_req, res) => res.json({ status: 'ok' }));
  router.use('/transactions', transactionsRouter);
  router.use('/budgets', budgetsRouter);
  router.use('/insights', insightsRouter);

  app.use('/api/v1', router);
}
