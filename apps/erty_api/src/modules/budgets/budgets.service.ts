import { v4 as uuid } from 'uuid';

import type { BudgetInput } from './budgets.schema.js';

export interface BudgetRecord extends BudgetInput {
  id: string;
  householdId: string;
  spent: number;
}

const budgets: BudgetRecord[] = [
  {
    id: uuid(),
    householdId: 'demo',
    category: 'Alimentação',
    limit: 150000,
    spent: 82000,
    currency: 'KZ',
    period: 'monthly',
  },
];

export async function listBudgets(): Promise<BudgetRecord[]> {
  return budgets;
}

export async function createBudget(
  input: BudgetInput,
  householdId: string,
): Promise<BudgetRecord> {
  const record: BudgetRecord = {
    id: uuid(),
    householdId,
    spent: 0,
    ...input,
  };
  budgets.push(record);
  return record;
}
