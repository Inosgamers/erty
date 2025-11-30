const { Transaction, Account } = require('../models');
const { Op } = require('sequelize');
const logger = require('../utils/logger');

class SyncService {
  /**
   * Sync offline transactions to server
   * @param {Object} user - User object
   * @param {Array} transactions - Array of offline transactions
   * @returns {Object} Sync results
   */
  async syncTransactions(user, transactions) {
    const results = {
      synced: [],
      conflicts: [],
      errors: []
    };

    for (const txData of transactions) {
      try {
        // Check if transaction already exists (by localId)
        if (txData.localId) {
          const existing = await Transaction.findOne({
            where: { localId: txData.localId, userId: user.id }
          });

          if (existing) {
            // Handle conflict
            const conflict = await this.resolveConflict(existing, txData, user);
            results.conflicts.push(conflict);
            continue;
          }
        }

        // Verify account ownership
        const account = await Account.findOne({
          where: { id: txData.accountId, userId: user.id }
        });

        if (!account) {
          results.errors.push({
            localId: txData.localId,
            error: 'Conta não encontrada'
          });
          continue;
        }

        // Create transaction
        const transaction = await Transaction.create({
          ...txData,
          userId: user.id,
          isSynced: true,
          syncedAt: new Date()
        });

        // Update account balance
        await this.updateAccountBalance(account, txData.type, txData.amount);

        results.synced.push({
          localId: txData.localId,
          serverId: transaction.id,
          syncedAt: transaction.syncedAt
        });

        logger.info(`Transaction synced: ${transaction.id} (local: ${txData.localId})`);
      } catch (error) {
        logger.error(`Sync error for transaction ${txData.localId}:`, error);
        results.errors.push({
          localId: txData.localId,
          error: error.message
        });
      }
    }

    return results;
  }

  /**
   * Resolve conflict between server and client data
   * Uses "last write wins" strategy with timestamp comparison
   */
  async resolveConflict(serverTx, clientTx, user) {
    const serverTime = new Date(serverTx.updatedAt);
    const clientTime = new Date(clientTx.updatedAt || clientTx.createdAt);

    // Server wins if client data is older
    if (clientTime <= serverTime) {
      return {
        localId: clientTx.localId,
        serverId: serverTx.id,
        resolution: 'server_wins',
        serverData: serverTx
      };
    }

    // Client wins - update server data
    await serverTx.update({
      ...clientTx,
      syncedAt: new Date()
    });

    return {
      localId: clientTx.localId,
      serverId: serverTx.id,
      resolution: 'client_wins',
      serverData: serverTx
    };
  }

  /**
   * Update account balance after transaction sync
   */
  async updateAccountBalance(account, type, amount) {
    let newBalance = parseFloat(account.currentBalance);

    if (type === 'expense') {
      newBalance -= parseFloat(amount);
    } else if (type === 'income') {
      newBalance += parseFloat(amount);
    }

    await account.update({ currentBalance: newBalance });
  }

  /**
   * Get updates for client since last sync
   */
  async getUpdates(user, lastSyncTime) {
    const where = {
      userId: user.id,
      syncedAt: {
        [Op.gt]: new Date(lastSyncTime)
      }
    };

    const transactions = await Transaction.findAll({
      where,
      order: [['syncedAt', 'ASC']]
    });

    const accounts = await Account.findAll({
      where: {
        userId: user.id,
        updatedAt: {
          [Op.gt]: new Date(lastSyncTime)
        }
      }
    });

    return {
      transactions,
      accounts,
      syncTime: new Date().toISOString()
    };
  }

  /**
   * Validate sync data integrity
   */
  validateSyncData(data) {
    const errors = [];

    if (!Array.isArray(data)) {
      errors.push('Data must be an array');
      return { valid: false, errors };
    }

    data.forEach((item, index) => {
      if (!item.localId) {
        errors.push(`Item ${index}: localId is required`);
      }
      if (!item.accountId) {
        errors.push(`Item ${index}: accountId is required`);
      }
      if (!item.amount || item.amount <= 0) {
        errors.push(`Item ${index}: valid amount is required`);
      }
      if (!['expense', 'income', 'transfer'].includes(item.type)) {
        errors.push(`Item ${index}: invalid transaction type`);
      }
    });

    return {
      valid: errors.length === 0,
      errors
    };
  }
}

module.exports = new SyncService();
