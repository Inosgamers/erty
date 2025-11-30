import 'dart:async';

import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../config/theme.dart';

final offlineSyncServiceProvider = Provider<OfflineSyncService>((ref) {
  return OfflineSyncService();
});

class OfflineSyncService {
  final _pendingOperations = <OfflineOperation>[];

  Future<void> enqueueOperation(OfflineOperation operation) async {
    _pendingOperations.add(operation);
  }

  Future<void> syncPendingOperations() async {
    // Simula envio ao backend e limpeza da fila.
    await Future.delayed(const Duration(milliseconds: 600));
    _pendingOperations.clear();
  }

  Future<OfflineSnapshot> summarize() async {
    await Future.delayed(const Duration(milliseconds: 450));

    final expenses = _pendingOperations
        .where((op) => op.type == OfflineOperationType.expense)
        .fold<double>(0, (sum, op) => sum + op.amount);

    final income = _pendingOperations
        .where((op) => op.type == OfflineOperationType.income)
        .fold<double>(0, (sum, op) => sum + op.amount);

    final balance = income - expenses;

    final mood = () {
      if (balance >= 1000) return FinancialMood.healthy;
      if (balance >= 0) return FinancialMood.attention;
      return FinancialMood.danger;
    }();

    return OfflineSnapshot(
      totalIncome: 4200 + income,
      totalExpenses: 3100 + expenses,
      projectedBalance: balance + 1100,
      wasteIndex: expenses > 0 ? expenses / (income + 1) : 0.12,
      goalsProgress: 0.72,
      householdMembers: 3,
      pendingOperations: _pendingOperations.length,
      mood: mood,
    );
  }
}

class OfflineSnapshot {
  const OfflineSnapshot({
    required this.totalIncome,
    required this.totalExpenses,
    required this.projectedBalance,
    required this.wasteIndex,
    required this.goalsProgress,
    required this.householdMembers,
    required this.pendingOperations,
    required this.mood,
  });

  final double totalIncome;
  final double totalExpenses;
  final double projectedBalance;
  final double wasteIndex;
  final double goalsProgress;
  final int householdMembers;
  final int pendingOperations;
  final FinancialMood mood;
}

class OfflineOperation {
  const OfflineOperation({
    required this.id,
    required this.type,
    required this.amount,
    required this.createdAt,
  });

  final String id;
  final OfflineOperationType type;
  final double amount;
  final DateTime createdAt;
}

enum OfflineOperationType { income, expense }
