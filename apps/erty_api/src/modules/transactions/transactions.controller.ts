import type { Response } from 'express';

import type { AuthenticatedRequest } from '../../middlewares/auth.js';
import { asyncHandler } from '../../utils/asyncHandler.js';
import { createTransaction, listTransactions } from './transactions.service.js';
import { transactionInputSchema } from './transactions.schema.js';

export const getTransactions = asyncHandler(async (req, res: Response) => {
  const items = await listTransactions();
  return res.json({ data: items });
});

export const postTransaction = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const payload = transactionInputSchema.parse(req.body);
    const householdId = (req.user?.household as string | undefined) ?? 'demo';
    const record = await createTransaction(payload, householdId);
    return res.status(201).json({ data: record });
  },
);
