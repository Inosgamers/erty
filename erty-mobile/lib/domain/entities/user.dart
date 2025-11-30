import 'package:equatable/equatable.dart';

class User extends Equatable {
  final String id;
  final String name;
  final String email;
  final String? phone;
  final String? avatar;
  final String currency;
  final String language;
  final bool isPremium;
  final DateTime? premiumUntil;
  final bool emailVerified;
  final bool twoFactorEnabled;
  final bool biometricEnabled;

  const User({
    required this.id,
    required this.name,
    required this.email,
    this.phone,
    this.avatar,
    required this.currency,
    required this.language,
    required this.isPremium,
    this.premiumUntil,
    required this.emailVerified,
    required this.twoFactorEnabled,
    required this.biometricEnabled,
  });

  @override
  List<Object?> get props => [
        id,
        name,
        email,
        phone,
        avatar,
        currency,
        language,
        isPremium,
        premiumUntil,
        emailVerified,
        twoFactorEnabled,
        biometricEnabled,
      ];

  User copyWith({
    String? id,
    String? name,
    String? email,
    String? phone,
    String? avatar,
    String? currency,
    String? language,
    bool? isPremium,
    DateTime? premiumUntil,
    bool? emailVerified,
    bool? twoFactorEnabled,
    bool? biometricEnabled,
  }) {
    return User(
      id: id ?? this.id,
      name: name ?? this.name,
      email: email ?? this.email,
      phone: phone ?? this.phone,
      avatar: avatar ?? this.avatar,
      currency: currency ?? this.currency,
      language: language ?? this.language,
      isPremium: isPremium ?? this.isPremium,
      premiumUntil: premiumUntil ?? this.premiumUntil,
      emailVerified: emailVerified ?? this.emailVerified,
      twoFactorEnabled: twoFactorEnabled ?? this.twoFactorEnabled,
      biometricEnabled: biometricEnabled ?? this.biometricEnabled,
    );
  }
}
