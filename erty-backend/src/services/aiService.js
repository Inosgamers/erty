const { Transaction, Category, Budget } = require('../models');
const { Op } = require('sequelize');
const moment = require('moment');
const logger = require('../utils/logger');

class AIFinanceService {
  /**
   * Analyze user spending patterns and generate insights
   */
  async analyzeSpendingPatterns(userId, months = 3) {
    try {
      const startDate = moment().subtract(months, 'months').startOf('month').toDate();
      const endDate = moment().endOf('month').toDate();

      const transactions = await Transaction.findAll({
        where: {
          userId,
          type: 'expense',
          date: { [Op.between]: [startDate, endDate] },
          status: 'completed'
        },
        include: [
          { model: Category, as: 'category', attributes: ['name', 'type'] }
        ],
        order: [['date', 'DESC']]
      });

      const insights = {
        totalExpenses: 0,
        averageMonthly: 0,
        topCategories: [],
        anomalies: [],
        recommendations: [],
        trend: 'stable'
      };

      // Calculate total and average
      insights.totalExpenses = transactions.reduce((sum, t) => sum + parseFloat(t.amount), 0);
      insights.averageMonthly = insights.totalExpenses / months;

      // Group by category
      const byCategory = {};
      transactions.forEach(t => {
        if (t.category) {
          const catName = t.category.name;
          if (!byCategory[catName]) {
            byCategory[catName] = { name: catName, total: 0, count: 0, transactions: [] };
          }
          byCategory[catName].total += parseFloat(t.amount);
          byCategory[catName].count += 1;
          byCategory[catName].transactions.push(t);
        }
      });

      // Top categories
      insights.topCategories = Object.values(byCategory)
        .sort((a, b) => b.total - a.total)
        .slice(0, 5)
        .map(c => ({
          category: c.name,
          total: c.total,
          count: c.count,
          percentage: ((c.total / insights.totalExpenses) * 100).toFixed(2)
        }));

      // Detect anomalies (expenses > 2x average)
      Object.values(byCategory).forEach(cat => {
        const average = cat.total / cat.count;
        cat.transactions.forEach(t => {
          if (parseFloat(t.amount) > average * 2) {
            insights.anomalies.push({
              date: t.date,
              category: cat.name,
              amount: t.amount,
              average: average.toFixed(2),
              description: t.description
            });
          }
        });
      });

      // Spending trend analysis
      const monthlySpending = this.calculateMonthlyTrend(transactions, months);
      insights.trend = monthlySpending.trend;
      insights.monthlyBreakdown = monthlySpending.breakdown;

      // Generate recommendations
      insights.recommendations = await this.generateRecommendations(userId, insights, byCategory);

      return insights;
    } catch (error) {
      logger.error('AI Analysis Error:', error);
      throw error;
    }
  }

  /**
   * Calculate monthly spending trend
   */
  calculateMonthlyTrend(transactions, months) {
    const breakdown = {};

    transactions.forEach(t => {
      const month = moment(t.date).format('YYYY-MM');
      if (!breakdown[month]) {
        breakdown[month] = 0;
      }
      breakdown[month] += parseFloat(t.amount);
    });

    const values = Object.values(breakdown);
    if (values.length < 2) {
      return { trend: 'insufficient_data', breakdown };
    }

    // Simple trend calculation
    const recent = values.slice(-2);
    const diff = recent[1] - recent[0];
    const percentChange = (diff / recent[0]) * 100;

    let trend = 'stable';
    if (percentChange > 10) trend = 'increasing';
    if (percentChange < -10) trend = 'decreasing';

    return { trend, breakdown, percentChange: percentChange.toFixed(2) };
  }

  /**
   * Generate personalized financial recommendations
   */
  async generateRecommendations(userId, insights, categoryData) {
    const recommendations = [];

    // Check budget compliance
    const budgets = await Budget.findAll({
      where: { userId, isActive: true },
      include: [{ model: Category, as: 'category' }]
    });

    budgets.forEach(budget => {
      const spent = budget.spent || 0;
      const percentage = (spent / budget.amount) * 100;

      if (percentage > 100) {
        recommendations.push({
          type: 'budget_exceeded',
          priority: 'high',
          title: `Orçamento de ${budget.name} excedido`,
          message: `Você gastou ${percentage.toFixed(0)}% do orçamento (${spent} de ${budget.amount})`,
          action: 'Considere reduzir gastos nesta categoria'
        });
      } else if (percentage > budget.alertThreshold) {
        recommendations.push({
          type: 'budget_warning',
          priority: 'medium',
          title: `Alerta de orçamento: ${budget.name}`,
          message: `Você já gastou ${percentage.toFixed(0)}% do orçamento`,
          action: 'Monitore seus gastos para não exceder o limite'
        });
      }
    });

    // Analyze top spending categories
    if (insights.topCategories.length > 0) {
      const topCategory = insights.topCategories[0];
      if (parseFloat(topCategory.percentage) > 40) {
        recommendations.push({
          type: 'high_category_spending',
          priority: 'medium',
          title: `Gastos elevados em ${topCategory.category}`,
          message: `${topCategory.percentage}% do seu orçamento vai para ${topCategory.category}`,
          action: 'Busque alternativas mais econômicas nesta categoria'
        });
      }
    }

    // Anomaly detection
    if (insights.anomalies.length > 0) {
      recommendations.push({
        type: 'unusual_expenses',
        priority: 'medium',
        title: 'Despesas incomuns detectadas',
        message: `Identificamos ${insights.anomalies.length} transações acima da média`,
        action: 'Revise suas despesas recentes para identificar gastos desnecessários',
        details: insights.anomalies.slice(0, 3)
      });
    }

    // Savings suggestion
    if (insights.averageMonthly > 0) {
      const suggestedSavings = insights.averageMonthly * 0.1; // 10% do gasto médio
      recommendations.push({
        type: 'savings_opportunity',
        priority: 'low',
        title: 'Oportunidade de poupança',
        message: `Você poderia economizar aproximadamente ${suggestedSavings.toFixed(2)} por mês`,
        action: 'Crie uma meta de poupança e automatize transferências mensais'
      });
    }

    // Trend-based recommendations
    if (insights.trend === 'increasing') {
      recommendations.push({
        type: 'increasing_expenses',
        priority: 'high',
        title: 'Seus gastos estão aumentando',
        message: `Suas despesas cresceram ${insights.monthlyBreakdown?.percentChange || 0}% no último mês`,
        action: 'Revise seus gastos e identifique onde é possível economizar'
      });
    }

    return recommendations.sort((a, b) => {
      const priority = { high: 3, medium: 2, low: 1 };
      return priority[b.priority] - priority[a.priority];
    });
  }

  /**
   * Predict future expenses based on historical data
   */
  async predictFutureExpenses(userId, months = 3) {
    try {
      const startDate = moment().subtract(months, 'months').startOf('month').toDate();
      
      const transactions = await Transaction.findAll({
        where: {
          userId,
          type: 'expense',
          date: { [Op.gte]: startDate },
          status: 'completed'
        }
      });

      const monthlyTotals = {};
      transactions.forEach(t => {
        const month = moment(t.date).format('YYYY-MM');
        monthlyTotals[month] = (monthlyTotals[month] || 0) + parseFloat(t.amount);
      });

      const values = Object.values(monthlyTotals);
      const average = values.reduce((a, b) => a + b, 0) / values.length;

      // Simple moving average prediction
      const prediction = {
        nextMonth: average,
        confidence: values.length >= 3 ? 'medium' : 'low',
        range: {
          min: average * 0.8,
          max: average * 1.2
        }
      };

      return prediction;
    } catch (error) {
      logger.error('Prediction Error:', error);
      throw error;
    }
  }

  /**
   * Suggest optimal budget based on spending history
   */
  async suggestBudget(userId) {
    const insights = await this.analyzeSpendingPatterns(userId, 3);
    
    const suggestions = insights.topCategories.map(cat => ({
      category: cat.category,
      currentAverage: parseFloat(cat.total / 3).toFixed(2),
      suggestedBudget: parseFloat((cat.total / 3) * 1.1).toFixed(2), // 10% buffer
      reason: `Baseado nos últimos 3 meses de gastos`
    }));

    return {
      totalSuggested: suggestions.reduce((sum, s) => sum + parseFloat(s.suggestedBudget), 0),
      categories: suggestions
    };
  }

  /**
   * Categorize transaction automatically using AI
   */
  async autoCategorizeTrans action(description, amount) {
    // Simple keyword-based categorization
    // In production, use ML model (TensorFlow.js)
    const keywords = {
      'mercado|supermercado|alimentação': 'Alimentação',
      'gasolina|combustível|posto': 'Transporte',
      'aluguel|renda': 'Moradia',
      'luz|água|energia|internet': 'Contas',
      'farmácia|médico|hospital': 'Saúde',
      'cinema|restaurante|lazer': 'Entretenimento',
      'academia|fitness': 'Saúde',
      'escola|curso|educação': 'Educação'
    };

    const descLower = description.toLowerCase();
    
    for (const [pattern, category] of Object.entries(keywords)) {
      const regex = new RegExp(pattern, 'i');
      if (regex.test(descLower)) {
        return {
          category,
          confidence: 0.75
        };
      }
    }

    return {
      category: 'Outros',
      confidence: 0.3
    };
  }
}

module.exports = new AIFinanceService();
