import { Queue } from 'bullmq';

import { env } from '../config/env.js';

export const offlineQueue = new Queue('offline-sync', {
  connection: env.REDIS_URL
    ? { connectionString: env.REDIS_URL }
    : { host: 'localhost', port: 6379 },
});

export async function enqueueOfflineBatch(batchId: string, operations: unknown[]) {
  await offlineQueue.add('sync', { batchId, operations }, { attempts: 3 });
}
