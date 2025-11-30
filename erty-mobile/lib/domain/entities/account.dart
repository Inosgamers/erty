import 'package:equatable/equatable.dart';

enum AccountType { checking, savings, credit, investment, cash, other }

class Account extends Equatable {
  final String id;
  final String userId;
  final String name;
  final AccountType type;
  final String currency;
  final double initialBalance;
  final double currentBalance;
  final String? institution;
  final String? accountNumber;
  final String color;
  final String icon;
  final bool isDefault;
  final bool includeInTotal;

  const Account({
    required this.id,
    required this.userId,
    required this.name,
    required this.type,
    required this.currency,
    required this.initialBalance,
    required this.currentBalance,
    this.institution,
    this.accountNumber,
    required this.color,
    required this.icon,
    this.isDefault = false,
    this.includeInTotal = true,
  });

  @override
  List<Object?> get props => [
        id,
        userId,
        name,
        type,
        currency,
        initialBalance,
        currentBalance,
        institution,
        accountNumber,
        color,
        icon,
        isDefault,
        includeInTotal,
      ];

  Account copyWith({
    String? id,
    String? userId,
    String? name,
    AccountType? type,
    String? currency,
    double? initialBalance,
    double? currentBalance,
    String? institution,
    String? accountNumber,
    String? color,
    String? icon,
    bool? isDefault,
    bool? includeInTotal,
  }) {
    return Account(
      id: id ?? this.id,
      userId: userId ?? this.userId,
      name: name ?? this.name,
      type: type ?? this.type,
      currency: currency ?? this.currency,
      initialBalance: initialBalance ?? this.initialBalance,
      currentBalance: currentBalance ?? this.currentBalance,
      institution: institution ?? this.institution,
      accountNumber: accountNumber ?? this.accountNumber,
      color: color ?? this.color,
      icon: icon ?? this.icon,
      isDefault: isDefault ?? this.isDefault,
      includeInTotal: includeInTotal ?? this.includeInTotal,
    );
  }
}
