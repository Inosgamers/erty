import { Router } from 'express';
import { z } from 'zod';

const transactionSchema = z.object({
  householdId: z.string().uuid(),
  type: z.enum(['expense', 'income', 'transfer']),
  category: z.string(),
  currency: z.string().min(3).max(3),
  amount: z.number().positive(),
  description: z.string().optional(),
  occurredAt: z.string().datetime()
});

export const financeRouter = Router();

financeRouter.post('/transactions', (req, res, next) => {
  const parsed = transactionSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: 'Invalid payload', errors: parsed.error.flatten() });
  }

  // TODO: persist via Prisma/Service layer.
  const transaction = { id: crypto.randomUUID(), ...parsed.data };
  return res.status(201).json({ transaction });
});

financeRouter.get('/budgets/summary', (_req, res, next) => {
  // TODO: consultar banco + FinAI para projeções reais.
  res.json({
    householdId: 'demo',
    month: '2025-11',
    limit: 250000,
    spent: 180000,
    projected: 240000,
    status: 'warning'
  });
});
