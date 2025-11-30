import { z } from 'zod';

export const budgetInputSchema = z.object({
  category: z.string().min(2),
  limit: z.number().positive(),
  currency: z.enum(['KZ', 'USD', 'EUR']).default('KZ'),
  period: z.enum(['monthly', 'quarterly', 'yearly']).default('monthly'),
});

export type BudgetInput = z.infer<typeof budgetInputSchema>;
