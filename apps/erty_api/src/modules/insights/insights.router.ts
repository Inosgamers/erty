import { Router } from 'express';
import { z } from 'zod';

import { authenticate } from '../../middlewares/auth.js';
import { asyncHandler } from '../../utils/asyncHandler.js';
import { generateInsight } from './insights.service.js';

const payloadSchema = z.object({
  wasteIndex: z.number().min(0).max(1),
});

export const insightsRouter = Router();

insightsRouter.use(authenticate);

insightsRouter.post(
  '/finai',
  asyncHandler(async (req, res) => {
    const payload = payloadSchema.parse(req.body);
    const data = await generateInsight({
      householdId: (req as any).user?.household ?? 'demo',
      wasteIndex: payload.wasteIndex,
    });
    return res.json({ data });
  }),
);
