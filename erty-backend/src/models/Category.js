const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Category = sequelize.define('Category', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: true, // null = categoria padrão do sistema
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
    type: DataTypes.ENUM('expense', 'income'),
    allowNull: false,
    defaultValue: 'expense'
  },
  parentId: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'categories',
      key: 'id'
    }
  },
  icon: {
    type: DataTypes.STRING,
    defaultValue: 'category'
  },
  color: {
    type: DataTypes.STRING,
    defaultValue: '#9E9E9E'
  },
  order: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  isSystem: {
    type: DataTypes.BOOLEAN,
    defaultValue: false // Categorias do sistema não podem ser deletadas
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  budget: {
    type: DataTypes.DECIMAL(15, 2),
    defaultValue: 0
  },
  description: {
    type: DataTypes.TEXT
  }
});

module.exports = Category;
