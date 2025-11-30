import 'package:flutter/material.dart';
import '../../domain/entities/transaction.dart';
import '../../domain/repositories/transaction_repository.dart';

enum TransactionLoadingState { initial, loading, loaded, error }

class TransactionProvider extends ChangeNotifier {
  final TransactionRepository _repository;

  TransactionLoadingState _state = TransactionLoadingState.initial;
  List<Transaction> _transactions = [];
  Map<String, dynamic>? _statistics;
  String? _errorMessage;

  TransactionProvider(this._repository);

  TransactionLoadingState get state => _state;
  List<Transaction> get transactions => _transactions;
  Map<String, dynamic>? get statistics => _statistics;
  String? get errorMessage => _errorMessage;

  Future<void> loadTransactions({
    int page = 1,
    int limit = 50,
    TransactionType? type,
    String? categoryId,
    String? accountId,
    DateTime? startDate,
    DateTime? endDate,
  }) async {
    _state = TransactionLoadingState.loading;
    _errorMessage = null;
    notifyListeners();

    try {
      _transactions = await _repository.getTransactions(
        page: page,
        limit: limit,
        type: type,
        categoryId: categoryId,
        accountId: accountId,
        startDate: startDate,
        endDate: endDate,
      );
      _state = TransactionLoadingState.loaded;
    } catch (e) {
      _state = TransactionLoadingState.error;
      _errorMessage = e.toString();
    }
    notifyListeners();
  }

  Future<bool> createTransaction(Transaction transaction) async {
    try {
      final newTransaction = await _repository.createTransaction(transaction);
      _transactions.insert(0, newTransaction);
      notifyListeners();
      return true;
    } catch (e) {
      _errorMessage = e.toString();
      notifyListeners();
      return false;
    }
  }

  Future<bool> updateTransaction(Transaction transaction) async {
    try {
      final updated = await _repository.updateTransaction(transaction);
      final index = _transactions.indexWhere((t) => t.id == updated.id);
      if (index != -1) {
        _transactions[index] = updated;
        notifyListeners();
      }
      return true;
    } catch (e) {
      _errorMessage = e.toString();
      notifyListeners();
      return false;
    }
  }

  Future<bool> deleteTransaction(String id) async {
    try {
      await _repository.deleteTransaction(id);
      _transactions.removeWhere((t) => t.id == id);
      notifyListeners();
      return true;
    } catch (e) {
      _errorMessage = e.toString();
      notifyListeners();
      return false;
    }
  }

  Future<void> loadStatistics({DateTime? startDate, DateTime? endDate}) async {
    try {
      _statistics = await _repository.getStatistics(
        startDate: startDate,
        endDate: endDate,
      );
      notifyListeners();
    } catch (e) {
      _errorMessage = e.toString();
      notifyListeners();
    }
  }

  void clearError() {
    _errorMessage = null;
    notifyListeners();
  }
}
