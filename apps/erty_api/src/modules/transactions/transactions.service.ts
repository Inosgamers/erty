import { v4 as uuid } from 'uuid';

import type { TransactionInput } from './transactions.schema.js';

export interface TransactionRecord extends TransactionInput {
  id: string;
  householdId: string;
  createdAt: Date;
  updatedAt: Date;
}

const inMemoryStore: TransactionRecord[] = [
  {
    id: uuid(),
    description: 'Supermercado Kero',
    amount: 12000,
    currency: 'KZ',
    type: 'expense',
    category: 'Mercado',
    member: 'Sara',
    accountName: 'Conta Família',
    occurredAt: new Date(Date.now() - 86_400_000),
    method: 'card',
    householdId: 'demo',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

export async function listTransactions(limit = 20): Promise<TransactionRecord[]> {
  return inMemoryStore.slice(0, limit);
}

export async function createTransaction(
  input: TransactionInput,
  householdId: string,
): Promise<TransactionRecord> {
  const now = new Date();
  const record: TransactionRecord = {
    ...input,
    id: uuid(),
    householdId,
    createdAt: now,
    updatedAt: now,
  };

  inMemoryStore.unshift(record);
  return record;
}
