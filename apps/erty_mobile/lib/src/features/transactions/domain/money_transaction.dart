import 'package:uuid/uuid.dart';

enum TransactionType { expense, income }

enum PaymentMethod { cash, card, transfer, mobile }

class MoneyTransaction {
  MoneyTransaction({
    String? id,
    required this.description,
    required this.amount,
    required this.currency,
    required this.type,
    required this.category,
    required this.performedAt,
    required this.accountName,
    required this.member,
    this.method = PaymentMethod.card,
  }) : id = id ?? const Uuid().v4();

  final String id;
  final String description;
  final double amount;
  final String currency;
  final TransactionType type;
  final String category;
  final DateTime performedAt;
  final String accountName;
  final String member;
  final PaymentMethod method;

  bool get isExpense => type == TransactionType.expense;
}
