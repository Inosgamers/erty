import 'dart:async';

import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../domain/money_transaction.dart';

final transactionRepositoryProvider = Provider<TransactionRepository>((ref) {
  return FakeTransactionRepository();
});

abstract class TransactionRepository {
  Future<List<MoneyTransaction>> fetchRecent();
  Future<void> add(MoneyTransaction transaction);
}

class FakeTransactionRepository implements TransactionRepository {
  final _store = <MoneyTransaction>[
    MoneyTransaction(
      description: 'Supermercado Kero',
      amount: 12000,
      currency: 'Kz',
      type: TransactionType.expense,
      category: 'Mercado',
      performedAt: DateTime.now().subtract(const Duration(days: 1)),
      accountName: 'Conta Família',
      member: 'Sara',
    ),
    MoneyTransaction(
      description: 'Salário João',
      amount: 450000,
      currency: 'Kz',
      type: TransactionType.income,
      category: 'Salário',
      performedAt: DateTime.now().subtract(const Duration(days: 3)),
      accountName: 'Banco Atlântico',
      member: 'João',
    ),
  ];

  @override
  Future<void> add(MoneyTransaction transaction) async {
    await Future.delayed(const Duration(milliseconds: 200));
    _store.insert(0, transaction);
  }

  @override
  Future<List<MoneyTransaction>> fetchRecent() async {
    await Future.delayed(const Duration(milliseconds: 300));
    return List.unmodifiable(_store);
  }
}
