import express from 'express';

import { healthRouter } from '../modules/health/health.controller.js';
import { financeRouter } from '../modules/finance/finance.controller.js';
import { insightsRouter } from '../modules/insights/insights.controller.js';

export const registerRoutes = (app: express.Application) => {
  app.use('/health', healthRouter);
  app.use('/finance', financeRouter);
  app.use('/insights', insightsRouter);
};
