const { Sequelize } = require('sequelize');
const logger = require('../utils/logger');

const sequelize = new Sequelize({
  dialect: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'erty_db',
  username: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD,
  pool: {
    max: parseInt(process.env.DB_POOL_MAX) || 10,
    min: parseInt(process.env.DB_POOL_MIN) || 2,
    acquire: 30000,
    idle: 10000
  },
  logging: process.env.NODE_ENV === 'development' ? 
    (msg) => logger.debug(msg) : false,
  timezone: '+01:00', // Angola timezone
  define: {
    timestamps: true,
    underscored: true,
    paranoid: true // Soft deletes
  }
});

module.exports = { sequelize };
