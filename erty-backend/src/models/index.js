const { sequelize } = require('../config/database');
const User = require('./User');
const Account = require('./Account');
const Category = require('./Category');
const Transaction = require('./Transaction');
const Budget = require('./Budget');
const Goal = require('./Goal');
const Investment = require('./Investment');
const { FamilyGroup, FamilyMember } = require('./FamilyGroup');

// User associations
User.hasMany(Account, { foreignKey: 'userId', as: 'accounts' });
User.hasMany(Transaction, { foreignKey: 'userId', as: 'transactions' });
User.hasMany(Category, { foreignKey: 'userId', as: 'categories' });
User.hasMany(Budget, { foreignKey: 'userId', as: 'budgets' });
User.hasMany(Goal, { foreignKey: 'userId', as: 'goals' });
User.hasMany(Investment, { foreignKey: 'userId', as: 'investments' });
User.hasMany(FamilyGroup, { foreignKey: 'ownerId', as: 'ownedGroups' });
User.belongsToMany(FamilyGroup, { through: FamilyMember, foreignKey: 'userId', as: 'familyGroups' });

// Account associations
Account.belongsTo(User, { foreignKey: 'userId', as: 'user' });
Account.hasMany(Transaction, { foreignKey: 'accountId', as: 'transactions' });

// Category associations
Category.belongsTo(User, { foreignKey: 'userId', as: 'user' });
Category.hasMany(Transaction, { foreignKey: 'categoryId', as: 'transactions' });
Category.hasMany(Budget, { foreignKey: 'categoryId', as: 'budgets' });
Category.belongsTo(Category, { foreignKey: 'parentId', as: 'parent' });
Category.hasMany(Category, { foreignKey: 'parentId', as: 'children' });

// Transaction associations
Transaction.belongsTo(User, { foreignKey: 'userId', as: 'user' });
Transaction.belongsTo(Account, { foreignKey: 'accountId', as: 'account' });
Transaction.belongsTo(Category, { foreignKey: 'categoryId', as: 'category' });
Transaction.belongsTo(Account, { foreignKey: 'toAccountId', as: 'toAccount' });

// Budget associations
Budget.belongsTo(User, { foreignKey: 'userId', as: 'user' });
Budget.belongsTo(Category, { foreignKey: 'categoryId', as: 'category' });

// Goal associations
Goal.belongsTo(User, { foreignKey: 'userId', as: 'user' });
Goal.belongsTo(Account, { foreignKey: 'linkedAccountId', as: 'linkedAccount' });

// Investment associations
Investment.belongsTo(User, { foreignKey: 'userId', as: 'user' });

// Family Group associations
FamilyGroup.belongsTo(User, { foreignKey: 'ownerId', as: 'owner' });
FamilyGroup.belongsToMany(User, { through: FamilyMember, foreignKey: 'familyGroupId', as: 'members' });

FamilyMember.belongsTo(FamilyGroup, { foreignKey: 'familyGroupId', as: 'group' });
FamilyMember.belongsTo(User, { foreignKey: 'userId', as: 'user' });

module.exports = {
  sequelize,
  User,
  Account,
  Category,
  Transaction,
  Budget,
  Goal,
  Investment,
  FamilyGroup,
  FamilyMember
};
