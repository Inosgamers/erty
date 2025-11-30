import { Pool, PoolClient } from 'pg';

import { env } from './env.js';
import { logger } from './logger.js';

const pool = env.DATABASE_URL
  ? new Pool({ connectionString: env.DATABASE_URL })
  : undefined;

export type DbClient = PoolClient;

export async function withDb<T>(fn: (client: PoolClient) => Promise<T>): Promise<T> {
  if (!pool) {
    logger.warn('DATABASE_URL não configurada. Retornando dados fake.');
    return fn({} as PoolClient);
  }

  const client = await pool.connect();
  try {
    return await fn(client);
  } finally {
    client.release();
  }
}
