import { z } from 'zod';

export const transactionInputSchema = z.object({
  description: z.string().min(2),
  amount: z.number().positive(),
  currency: z.enum(['KZ', 'USD', 'EUR']).default('KZ'),
  type: z.enum(['expense', 'income']),
  category: z.string().min(2),
  member: z.string().min(2),
  accountName: z.string().min(2),
  occurredAt: z.coerce.date(),
  method: z.enum(['cash', 'card', 'transfer', 'mobile']).default('card'),
});

export type TransactionInput = z.infer<typeof transactionInputSchema>;
