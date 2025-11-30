import 'package:flutter/material.dart';
import '../../domain/entities/budget.dart';
import '../../domain/repositories/budget_repository.dart';

enum BudgetLoadingState { initial, loading, loaded, error }

class BudgetProvider extends ChangeNotifier {
  final BudgetRepository _repository;

  BudgetLoadingState _state = BudgetLoadingState.initial;
  List<Budget> _budgets = [];
  String? _errorMessage;

  BudgetProvider(this._repository);

  BudgetLoadingState get state => _state;
  List<Budget> get budgets => _budgets;
  String? get errorMessage => _errorMessage;

  Future<void> loadBudgets() async {
    _state = BudgetLoadingState.loading;
    _errorMessage = null;
    notifyListeners();

    try {
      _budgets = await _repository.getBudgets();
      _state = BudgetLoadingState.loaded;
    } catch (e) {
      _state = BudgetLoadingState.error;
      _errorMessage = e.toString();
    }
    notifyListeners();
  }

  Future<bool> createBudget(Budget budget) async {
    try {
      final newBudget = await _repository.createBudget(budget);
      _budgets.add(newBudget);
      notifyListeners();
      return true;
    } catch (e) {
      _errorMessage = e.toString();
      notifyListeners();
      return false;
    }
  }

  Future<bool> updateBudget(Budget budget) async {
    try {
      final updated = await _repository.updateBudget(budget);
      final index = _budgets.indexWhere((b) => b.id == updated.id);
      if (index != -1) {
        _budgets[index] = updated;
        notifyListeners();
      }
      return true;
    } catch (e) {
      _errorMessage = e.toString();
      notifyListeners();
      return false;
    }
  }

  Future<bool> deleteBudget(String id) async {
    try {
      await _repository.deleteBudget(id);
      _budgets.removeWhere((b) => b.id == id);
      notifyListeners();
      return true;
    } catch (e) {
      _errorMessage = e.toString();
      notifyListeners();
      return false;
    }
  }

  void clearError() {
    _errorMessage = null;
    notifyListeners();
  }
}
