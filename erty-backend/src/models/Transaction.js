const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Transaction = sequelize.define('Transaction', {
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
  accountId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'accounts',
      key: 'id'
    }
  },
  categoryId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'categories',
      key: 'id'
    }
  },
  type: {
    type: DataTypes.ENUM('expense', 'income', 'transfer'),
    allowNull: false
  },
  amount: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: false,
    validate: {
      min: 0
    }
  },
  currency: {
    type: DataTypes.STRING,
    defaultValue: 'AOA'
  },
  description: {
    type: DataTypes.TEXT
  },
  date: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  paymentMethod: {
    type: DataTypes.ENUM(
      'cash',
      'debit_card',
      'credit_card',
      'bank_transfer',
      'pix',
      'mobile_money',
      'other'
    ),
    defaultValue: 'cash'
  },
  status: {
    type: DataTypes.ENUM('pending', 'completed', 'cancelled'),
    defaultValue: 'completed'
  },
  isRecurring: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  recurringId: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'recurring_transactions',
      key: 'id'
    }
  },
  toAccountId: {
    type: DataTypes.UUID,
    allowNull: true, // Usado em transferências
    references: {
      model: 'accounts',
      key: 'id'
    }
  },
  attachments: {
    type: DataTypes.JSONB,
    defaultValue: []
  },
  location: {
    type: DataTypes.JSONB,
    defaultValue: null // { latitude, longitude, address }
  },
  tags: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    defaultValue: []
  },
  notes: {
    type: DataTypes.TEXT
  },
  isSynced: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  syncedAt: {
    type: DataTypes.DATE
  },
  localId: {
    type: DataTypes.STRING, // ID local do dispositivo (para sincronização offline)
    unique: true
  },
  aiSuggested: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  aiConfidence: {
    type: DataTypes.DECIMAL(3, 2),
    validate: {
      min: 0,
      max: 1
    }
  },
  metadata: {
    type: DataTypes.JSONB,
    defaultValue: {}
  }
});

module.exports = Transaction;
