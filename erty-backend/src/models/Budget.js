const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Budget = sequelize.define('Budget', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  categoryId: {
    type: DataTypes.UUID,
    allowNull: true, // null = orçamento geral
    references: {
      model: 'categories',
      key: 'id'
    }
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  amount: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: false,
    validate: {
      min: 0
    }
  },
  period: {
    type: DataTypes.ENUM('daily', 'weekly', 'monthly', 'yearly'),
    defaultValue: 'monthly'
  },
  startDate: {
    type: DataTypes.DATE,
    allowNull: false
  },
  endDate: {
    type: DataTypes.DATE,
    allowNull: false
  },
  spent: {
    type: DataTypes.DECIMAL(15, 2),
    defaultValue: 0
  },
  alertThreshold: {
    type: DataTypes.INTEGER,
    defaultValue: 80, // Alerta quando atingir 80%
    validate: {
      min: 0,
      max: 100
    }
  },
  alertSent: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  rollover: {
    type: DataTypes.BOOLEAN,
    defaultValue: false // Transferir saldo não gasto para próximo período
  },
  color: {
    type: DataTypes.STRING,
    defaultValue: '#4CAF50'
  },
  notes: {
    type: DataTypes.TEXT
  }
});

module.exports = Budget;
