import 'package:equatable/equatable.dart';

enum BudgetPeriod { daily, weekly, monthly, yearly }

class Budget extends Equatable {
  final String id;
  final String userId;
  final String? categoryId;
  final String name;
  final double amount;
  final BudgetPeriod period;
  final DateTime startDate;
  final DateTime endDate;
  final double spent;
  final int alertThreshold;
  final bool alertSent;
  final String color;

  const Budget({
    required this.id,
    required this.userId,
    this.categoryId,
    required this.name,
    required this.amount,
    required this.period,
    required this.startDate,
    required this.endDate,
    this.spent = 0.0,
    this.alertThreshold = 80,
    this.alertSent = false,
    required this.color,
  });

  double get percentage => (spent / amount) * 100;
  double get remaining => amount - spent;
  bool get isExceeded => spent > amount;
  bool get isNearLimit => percentage >= alertThreshold;

  @override
  List<Object?> get props => [
        id,
        userId,
        categoryId,
        name,
        amount,
        period,
        startDate,
        endDate,
        spent,
        alertThreshold,
        alertSent,
        color,
      ];

  Budget copyWith({
    String? id,
    String? userId,
    String? categoryId,
    String? name,
    double? amount,
    BudgetPeriod? period,
    DateTime? startDate,
    DateTime? endDate,
    double? spent,
    int? alertThreshold,
    bool? alertSent,
    String? color,
  }) {
    return Budget(
      id: id ?? this.id,
      userId: userId ?? this.userId,
      categoryId: categoryId ?? this.categoryId,
      name: name ?? this.name,
      amount: amount ?? this.amount,
      period: period ?? this.period,
      startDate: startDate ?? this.startDate,
      endDate: endDate ?? this.endDate,
      spent: spent ?? this.spent,
      alertThreshold: alertThreshold ?? this.alertThreshold,
      alertSent: alertSent ?? this.alertSent,
      color: color ?? this.color,
    );
  }
}
