import type { NextFunction, Request, Response } from 'express';
import jwt, { type JwtPayload } from 'jsonwebtoken';

import { env } from '../config/env.js';
import { logger } from '../config/logger.js';

export interface AuthenticatedRequest extends Request {
  user?: JwtPayload;
}

export function authenticate(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Token não informado' });
  }

  const token = authHeader.replace('Bearer ', '');

  if (!env.JWT_PUBLIC_KEY) {
    logger.warn('JWT_PUBLIC_KEY ausente, aceitando token sem validação (dev)');
    req.user = { sub: 'dev-user', scope: 'admin' };
    return next();
  }

  try {
    const payload = jwt.verify(token, env.JWT_PUBLIC_KEY, {
      algorithms: ['RS256'],
      audience: env.JWT_AUDIENCE,
      issuer: env.JWT_ISSUER,
    });
    req.user = payload as JwtPayload;
    return next();
  } catch (error) {
    logger.warn({ error }, 'Token JWT inválido');
    return res.status(401).json({ message: 'Token inválido' });
  }
}
