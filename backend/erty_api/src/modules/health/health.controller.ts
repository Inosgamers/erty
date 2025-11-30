import { Router } from 'express';

export const healthRouter = Router();

healthRouter.get('/', (_req, res) => {
  res.json({
    status: 'ok',
    message: 'Erty API saudável',
    timestamp: new Date().toISOString()
  });
});
