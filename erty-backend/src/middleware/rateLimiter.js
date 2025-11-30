const rateLimit = require('express-rate-limit');

const createRateLimiter = (windowMs, max, message) => {
  return rateLimit({
    windowMs: windowMs || 15 * 60 * 1000, // 15 minutes
    max: max || 100,
    message: message || 'Muitas requisições deste IP, tente novamente mais tarde',
    standardHeaders: true,
    legacyHeaders: false,
  });
};

const authLimiter = createRateLimiter(
  15 * 60 * 1000, // 15 minutes
  5, // 5 attempts
  'Muitas tentativas de login. Tente novamente em 15 minutos'
);

const apiLimiter = createRateLimiter(
  15 * 60 * 1000, // 15 minutes
  100 // 100 requests
);

const strictLimiter = createRateLimiter(
  60 * 60 * 1000, // 1 hour
  10, // 10 requests
  'Limite de requisições atingido. Tente novamente em 1 hora'
);

module.exports = {
  createRateLimiter,
  authLimiter,
  apiLimiter,
  strictLimiter
};
