const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Investment = sequelize.define('Investment', {
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
    allowNull: false
  },
  type: {
    type: DataTypes.ENUM(
      'savings_account',
      'stocks',
      'bonds',
      'real_estate',
      'cryptocurrency',
      'mutual_funds',
      'fixed_deposit',
      'other'
    ),
    allowNull: false
  },
  institution: {
    type: DataTypes.STRING
  },
  initialAmount: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: false
  },
  currentAmount: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: false
  },
  currency: {
    type: DataTypes.STRING,
    defaultValue: 'AOA'
  },
  purchaseDate: {
    type: DataTypes.DATE,
    allowNull: false
  },
  maturityDate: {
    type: DataTypes.DATE
  },
  interestRate: {
    type: DataTypes.DECIMAL(5, 2),
    defaultValue: 0
  },
  riskLevel: {
    type: DataTypes.ENUM('very_low', 'low', 'medium', 'high', 'very_high'),
    defaultValue: 'medium'
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  color: {
    type: DataTypes.STRING,
    defaultValue: '#673AB7'
  },
  icon: {
    type: DataTypes.STRING,
    defaultValue: 'trending_up'
  },
  notes: {
    type: DataTypes.TEXT
  },
  metadata: {
    type: DataTypes.JSONB,
    defaultValue: {} // Ticker symbols, códigos, etc.
  }
});

module.exports = Investment;
