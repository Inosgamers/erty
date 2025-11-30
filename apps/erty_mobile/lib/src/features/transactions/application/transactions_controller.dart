import 'dart:async';

import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../domain/money_transaction.dart';
import '../infrastructure/transaction_repository.dart';

final transactionsControllerProvider = AutoDisposeAsyncNotifierProvider<
    TransactionsController, List<MoneyTransaction>>(() {
  return TransactionsController();
});

class TransactionsController
    extends AutoDisposeAsyncNotifier<List<MoneyTransaction>> {
  late final TransactionRepository _repository;

  @override
  FutureOr<List<MoneyTransaction>> build() async {
    _repository = ref.read(transactionRepositoryProvider);
    return _repository.fetchRecent();
  }

  Future<void> addTransaction(MoneyTransaction transaction) async {
    state = const AsyncLoading();
    await _repository.add(transaction);
    state = AsyncData(await _repository.fetchRecent());
  }
}
