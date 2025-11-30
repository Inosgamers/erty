class AppConfig {
  static const String appName = 'Erty - Finanças em Ordem';
  static const String appVersion = '1.0.0';
  
  // API Configuration
  static const String apiBaseUrl = 'http://localhost:3000/api/v1';
  static const String apiTimeout = '30000'; // 30 seconds
  
  // Storage Keys
  static const String keyAuthToken = 'auth_token';
  static const String keyRefreshToken = 'refresh_token';
  static const String keyUserId = 'user_id';
  static const String keyUserData = 'user_data';
  static const String keyLastSync = 'last_sync';
  static const String keyThemeMode = 'theme_mode';
  static const String keyBiometricEnabled = 'biometric_enabled';
  
  // Hive Box Names
  static const String boxTransactions = 'transactions';
  static const String boxAccounts = 'accounts';
  static const String boxCategories = 'categories';
  static const String boxBudgets = 'budgets';
  static const String boxGoals = 'goals';
  static const String boxPendingSync = 'pending_sync';
  
  // Defaults
  static const String defaultCurrency = 'AOA';
  static const String defaultLanguage = 'pt';
  static const int syncIntervalMinutes = 15;
  static const int maxOfflineTransactions = 1000;
  
  // Colors
  static const int primaryColor = 0xFF2196F3;
  static const int accentColor = 0xFF4CAF50;
  static const int errorColor = 0xFFF44336;
  static const int warningColor = 0xFFFF9800;
  static const int successColor = 0xFF4CAF50;
}
