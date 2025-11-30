import { Router } from 'express';

import { authenticate } from '../../middlewares/auth.js';
import { getTransactions, postTransaction } from './transactions.controller.js';

export const transactionsRouter = Router();

transactionsRouter.use(authenticate);
transactionsRouter.get('/', getTransactions);
transactionsRouter.post('/', postTransaction);
