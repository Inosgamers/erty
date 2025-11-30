import '../entities/budget.dart';

abstract class BudgetRepository {
  Future<List<Budget>> getBudgets();
  Future<Budget> getBudget(String id);
  Future<Budget> createBudget(Budget budget);
  Future<Budget> updateBudget(Budget budget);
  Future<void> deleteBudget(String id);
  Future<List<Map<String, dynamic>>> checkAlerts();
}
