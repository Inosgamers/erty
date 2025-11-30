import { config } from 'dotenv';
import { z } from 'zod';

config();

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().default(4000),
  DATABASE_URL: z.string().url().optional(),
  REDIS_URL: z.string().url().optional(),
  JWT_AUDIENCE: z.string().default('erty-app'),
  JWT_ISSUER: z.string().default('erty-api'),
  JWT_PUBLIC_KEY: z.string().optional(),
});

export const env = envSchema.parse(process.env);
