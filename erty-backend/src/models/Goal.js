const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Goal = sequelize.define('Goal', {
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
  description: {
    type: DataTypes.TEXT
  },
  targetAmount: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: false,
    validate: {
      min: 0
    }
  },
  currentAmount: {
    type: DataTypes.DECIMAL(15, 2),
    defaultValue: 0
  },
  currency: {
    type: DataTypes.STRING,
    defaultValue: 'AOA'
  },
  startDate: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  targetDate: {
    type: DataTypes.DATE,
    allowNull: false
  },
  priority: {
    type: DataTypes.ENUM('low', 'medium', 'high', 'urgent'),
    defaultValue: 'medium'
  },
  icon: {
    type: DataTypes.STRING,
    defaultValue: 'flag'
  },
  color: {
    type: DataTypes.STRING,
    defaultValue: '#FF9800'
  },
  category: {
    type: DataTypes.ENUM(
      'emergency_fund',
      'vacation',
      'house',
      'car',
      'education',
      'retirement',
      'debt_payment',
      'other'
    ),
    defaultValue: 'other'
  },
  isCompleted: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  completedAt: {
    type: DataTypes.DATE
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  autoContribution: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  contributionAmount: {
    type: DataTypes.DECIMAL(15, 2),
    defaultValue: 0
  },
  contributionFrequency: {
    type: DataTypes.ENUM('daily', 'weekly', 'monthly'),
    defaultValue: 'monthly'
  },
  linkedAccountId: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'accounts',
      key: 'id'
    }
  },
  reminderEnabled: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  reminderFrequency: {
    type: DataTypes.ENUM('daily', 'weekly', 'monthly'),
    defaultValue: 'weekly'
  },
  notes: {
    type: DataTypes.TEXT
  }
});

module.exports = Goal;
