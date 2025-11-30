const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Account = sequelize.define('Account', {
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
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true
    }
  },
  type: {
    type: DataTypes.ENUM(
      'checking', // Conta corrente
      'savings',  // Poupança
      'credit',   // Cartão de crédito
      'investment', // Investimento
      'cash',     // Dinheiro
      'other'     // Outro
    ),
    allowNull: false,
    defaultValue: 'checking'
  },
  currency: {
    type: DataTypes.STRING,
    defaultValue: 'AOA',
    validate: {
      isIn: [['AOA', 'USD', 'EUR', 'BRL']]
    }
  },
  initialBalance: {
    type: DataTypes.DECIMAL(15, 2),
    defaultValue: 0
  },
  currentBalance: {
    type: DataTypes.DECIMAL(15, 2),
    defaultValue: 0
  },
  creditLimit: {
    type: DataTypes.DECIMAL(15, 2),
    defaultValue: 0
  },
  institution: {
    type: DataTypes.STRING // Nome do banco/instituição
  },
  accountNumber: {
    type: DataTypes.STRING
  },
  color: {
    type: DataTypes.STRING,
    defaultValue: '#2196F3'
  },
  icon: {
    type: DataTypes.STRING,
    defaultValue: 'account_balance'
  },
  isDefault: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  isShared: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  includeInTotal: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  status: {
    type: DataTypes.ENUM('active', 'inactive', 'archived'),
    defaultValue: 'active'
  },
  metadata: {
    type: DataTypes.JSONB,
    defaultValue: {}
  }
});

module.exports = Account;
