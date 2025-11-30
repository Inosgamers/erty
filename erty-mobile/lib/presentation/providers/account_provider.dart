import 'package:flutter/material.dart';
import '../../domain/entities/account.dart';
import '../../domain/repositories/account_repository.dart';

enum AccountLoadingState { initial, loading, loaded, error }

class AccountProvider extends ChangeNotifier {
  final AccountRepository _repository;

  AccountLoadingState _state = AccountLoadingState.initial;
  List<Account> _accounts = [];
  double _totalBalance = 0.0;
  String? _errorMessage;

  AccountProvider(this._repository);

  AccountLoadingState get state => _state;
  List<Account> get accounts => _accounts;
  double get totalBalance => _totalBalance;
  String? get errorMessage => _errorMessage;

  Future<void> loadAccounts() async {
    _state = AccountLoadingState.loading;
    _errorMessage = null;
    notifyListeners();

    try {
      _accounts = await _repository.getAccounts();
      _totalBalance = await _repository.getTotalBalance();
      _state = AccountLoadingState.loaded;
    } catch (e) {
      _state = AccountLoadingState.error;
      _errorMessage = e.toString();
    }
    notifyListeners();
  }

  Future<bool> createAccount(Account account) async {
    try {
      final newAccount = await _repository.createAccount(account);
      _accounts.add(newAccount);
      _totalBalance = await _repository.getTotalBalance();
      notifyListeners();
      return true;
    } catch (e) {
      _errorMessage = e.toString();
      notifyListeners();
      return false;
    }
  }

  Future<bool> updateAccount(Account account) async {
    try {
      final updated = await _repository.updateAccount(account);
      final index = _accounts.indexWhere((a) => a.id == updated.id);
      if (index != -1) {
        _accounts[index] = updated;
        _totalBalance = await _repository.getTotalBalance();
        notifyListeners();
      }
      return true;
    } catch (e) {
      _errorMessage = e.toString();
      notifyListeners();
      return false;
    }
  }

  Future<bool> deleteAccount(String id) async {
    try {
      await _repository.deleteAccount(id);
      _accounts.removeWhere((a) => a.id == id);
      _totalBalance = await _repository.getTotalBalance();
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
