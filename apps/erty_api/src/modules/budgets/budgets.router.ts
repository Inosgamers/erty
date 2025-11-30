import { Router } from 'express';

import { authenticate } from '../../middlewares/auth.js';
import { asyncHandler } from '../../utils/asyncHandler.js';
import { budgetInputSchema } from './budgets.schema.js';
import { createBudget, listBudgets } from './budgets.service.js';

export const budgetsRouter = Router();

budgetsRouter.use(authenticate);

budgetsRouter.get(
  '/',
  asyncHandler(async (_req, res) => {
    const data = await listBudgets();
    return res.json({ data });
  }),
);

budgetsRouter.post(
  '/',
  asyncHandler(async (req, res) => {
    const payload = budgetInputSchema.parse(req.body);
    const record = await createBudget(payload, 'demo');
    return res.status(201).json({ data: record });
  }),
);
