import 'package:get_it/get_it.dart';
import 'package:dio/dio.dart';
import 'package:shared_preferences/shared_preferences.dart';

import '../config/app_config.dart';
import '../../data/datasources/local/local_storage.dart';
import '../../data/datasources/remote/api_client.dart';
import '../../data/repositories/auth_repository_impl.dart';
import '../../data/repositories/transaction_repository_impl.dart';
import '../../data/repositories/account_repository_impl.dart';
import '../../data/repositories/budget_repository_impl.dart';
import '../../domain/repositories/auth_repository.dart';
import '../../domain/repositories/transaction_repository.dart';
import '../../domain/repositories/account_repository.dart';
import '../../domain/repositories/budget_repository.dart';
import '../../presentation/providers/auth_provider.dart';
import '../../presentation/providers/theme_provider.dart';
import '../../presentation/providers/transaction_provider.dart';
import '../../presentation/providers/account_provider.dart';
import '../../presentation/providers/budget_provider.dart';

final getIt = GetIt.instance;

Future<void> setupDependencyInjection() async {
  // External dependencies
  final sharedPreferences = await SharedPreferences.getInstance();
  getIt.registerSingleton<SharedPreferences>(sharedPreferences);
  
  // Dio
  final dio = Dio(
    BaseOptions(
      baseUrl: AppConfig.apiBaseUrl,
      connectTimeout: const Duration(milliseconds: 30000),
      receiveTimeout: const Duration(milliseconds: 30000),
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    ),
  );
  getIt.registerSingleton<Dio>(dio);
  
  // Data sources
  getIt.registerLazySingleton<LocalStorage>(
    () => LocalStorage(getIt<SharedPreferences>()),
  );
  
  getIt.registerLazySingleton<ApiClient>(
    () => ApiClient(getIt<Dio>(), getIt<LocalStorage>()),
  );
  
  // Repositories
  getIt.registerLazySingleton<AuthRepository>(
    () => AuthRepositoryImpl(getIt<ApiClient>(), getIt<LocalStorage>()),
  );
  
  getIt.registerLazySingleton<TransactionRepository>(
    () => TransactionRepositoryImpl(getIt<ApiClient>(), getIt<LocalStorage>()),
  );
  
  getIt.registerLazySingleton<AccountRepository>(
    () => AccountRepositoryImpl(getIt<ApiClient>(), getIt<LocalStorage>()),
  );
  
  getIt.registerLazySingleton<BudgetRepository>(
    () => BudgetRepositoryImpl(getIt<ApiClient>(), getIt<LocalStorage>()),
  );
  
  // Providers
  getIt.registerFactory<ThemeProvider>(
    () => ThemeProvider(getIt<LocalStorage>()),
  );
  
  getIt.registerFactory<AuthProvider>(
    () => AuthProvider(getIt<AuthRepository>()),
  );
  
  getIt.registerFactory<TransactionProvider>(
    () => TransactionProvider(getIt<TransactionRepository>()),
  );
  
  getIt.registerFactory<AccountProvider>(
    () => AccountProvider(getIt<AccountRepository>()),
  );
  
  getIt.registerFactory<BudgetProvider>(
    () => BudgetProvider(getIt<BudgetRepository>()),
  );
}
