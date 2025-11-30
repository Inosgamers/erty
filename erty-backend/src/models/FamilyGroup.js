const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const FamilyGroup = sequelize.define('FamilyGroup', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  ownerId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  description: {
    type: DataTypes.TEXT
  },
  currency: {
    type: DataTypes.STRING,
    defaultValue: 'AOA'
  },
  avatar: {
    type: DataTypes.STRING
  },
  inviteCode: {
    type: DataTypes.STRING,
    unique: true
  },
  settings: {
    type: DataTypes.JSONB,
    defaultValue: {
      requireApproval: true,
      allowMemberTransactions: true,
      shareAllAccounts: false,
      memberCanInvite: false
    }
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
});

const FamilyMember = sequelize.define('FamilyMember', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  familyGroupId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'family_groups',
      key: 'id'
    }
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  role: {
    type: DataTypes.ENUM('owner', 'admin', 'member', 'viewer'),
    defaultValue: 'member'
  },
  permissions: {
    type: DataTypes.JSONB,
    defaultValue: {
      canView: true,
      canAdd: true,
      canEdit: false,
      canDelete: false,
      canApprove: false,
      canManageMembers: false
    }
  },
  nickname: {
    type: DataTypes.STRING
  },
  joinedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  status: {
    type: DataTypes.ENUM('pending', 'active', 'suspended'),
    defaultValue: 'active'
  }
});

module.exports = { FamilyGroup, FamilyMember };
