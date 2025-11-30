import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import pinoHttp from 'pino-http';

import { logger } from './config/logger.js';
import { errorHandler } from './middlewares/error-handler.js';
import { registerRoutes } from './routes/index.js';

export function createApp() {
  const app = express();

  app.use(helmet());
  app.use(cors({ origin: '*' }));
  app.use(express.json({ limit: '1mb' }));
  app.use(pinoHttp({ logger }));

  registerRoutes(app);

  app.use(errorHandler);

  return app;
}
