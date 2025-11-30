const redis = require('redis');
const logger = require('../utils/logger');

let redisClient = null;

const initializeRedis = async () => {
  try {
    redisClient = redis.createClient({
      host: process.env.REDIS_HOST || 'localhost',
      port: process.env.REDIS_PORT || 6379,
      password: process.env.REDIS_PASSWORD || undefined,
      socket: {
        reconnectStrategy: (retries) => {
          if (retries > 10) {
            logger.error('Redis: Máximo de tentativas de reconexão atingido');
            return new Error('Redis reconexão falhou');
          }
          return retries * 100;
        }
      }
    });

    redisClient.on('error', (err) => {
      logger.error('Redis Error:', err);
    });

    redisClient.on('connect', () => {
      logger.info('Redis conectado com sucesso');
    });

    await redisClient.connect();
    return redisClient;
  } catch (error) {
    logger.error('Erro ao conectar Redis:', error);
    // Continue without Redis in development
    if (process.env.NODE_ENV === 'production') {
      throw error;
    }
  }
};

const getRedisClient = () => redisClient;

const cacheGet = async (key) => {
  if (!redisClient) return null;
  try {
    const data = await redisClient.get(key);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    logger.error('Redis GET error:', error);
    return null;
  }
};

const cacheSet = async (key, value, ttl = 3600) => {
  if (!redisClient) return false;
  try {
    await redisClient.setEx(key, ttl, JSON.stringify(value));
    return true;
  } catch (error) {
    logger.error('Redis SET error:', error);
    return false;
  }
};

const cacheDel = async (key) => {
  if (!redisClient) return false;
  try {
    await redisClient.del(key);
    return true;
  } catch (error) {
    logger.error('Redis DEL error:', error);
    return false;
  }
};

module.exports = {
  initializeRedis,
  getRedisClient,
  cacheGet,
  cacheSet,
  cacheDel
};
