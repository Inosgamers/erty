import 'package:equatable/equatable.dart';

enum TransactionType { expense, income, transfer }

class Transaction extends Equatable {
  final String id;
  final String userId;
  final String accountId;
  final String categoryId;
  final TransactionType type;
  final double amount;
  final String currency;
  final String? description;
  final DateTime date;
  final String paymentMethod;
  final String status;
  final List<String> tags;
  final String? notes;
  final bool isSynced;
  final String? localId;

  const Transaction({
    required this.id,
    required this.userId,
    required this.accountId,
    required this.categoryId,
    required this.type,
    required this.amount,
    required this.currency,
    this.description,
    required this.date,
    required this.paymentMethod,
    required this.status,
    this.tags = const [],
    this.notes,
    this.isSynced = false,
    this.localId,
  });

  @override
  List<Object?> get props => [
        id,
        userId,
        accountId,
        categoryId,
        type,
        amount,
        currency,
        description,
        date,
        paymentMethod,
        status,
        tags,
        notes,
        isSynced,
        localId,
      ];

  Transaction copyWith({
    String? id,
    String? userId,
    String? accountId,
    String? categoryId,
    TransactionType? type,
    double? amount,
    String? currency,
    String? description,
    DateTime? date,
    String? paymentMethod,
    String? status,
    List<String>? tags,
    String? notes,
    bool? isSynced,
    String? localId,
  }) {
    return Transaction(
      id: id ?? this.id,
      userId: userId ?? this.userId,
      accountId: accountId ?? this.accountId,
      categoryId: categoryId ?? this.categoryId,
      type: type ?? this.type,
      amount: amount ?? this.amount,
      currency: currency ?? this.currency,
      description: description ?? this.description,
      date: date ?? this.date,
      paymentMethod: paymentMethod ?? this.paymentMethod,
      status: status ?? this.status,
      tags: tags ?? this.tags,
      notes: notes ?? this.notes,
      isSynced: isSynced ?? this.isSynced,
      localId: localId ?? this.localId,
    );
  }
}
