import 'package:go_router/go_router.dart';
import 'package:flutter/material.dart';

import '../../presentation/screens/splash/splash_screen.dart';
import '../../presentation/screens/auth/login_screen.dart';
import '../../presentation/screens/auth/register_screen.dart';
import '../../presentation/screens/home/home_screen.dart';
import '../../presentation/screens/transactions/transaction_list_screen.dart';
import '../../presentation/screens/transactions/add_transaction_screen.dart';
import '../../presentation/screens/accounts/account_list_screen.dart';
import '../../presentation/screens/budgets/budget_list_screen.dart';
import '../../presentation/screens/goals/goal_list_screen.dart';
import '../../presentation/screens/reports/reports_screen.dart';
import '../../presentation/screens/settings/settings_screen.dart';

class AppRouter {
  static const String splash = '/';
  static const String login = '/login';
  static const String register = '/register';
  static const String home = '/home';
  static const String transactions = '/transactions';
  static const String addTransaction = '/add-transaction';
  static const String accounts = '/accounts';
  static const String budgets = '/budgets';
  static const String goals = '/goals';
  static const String reports = '/reports';
  static const String settings = '/settings';
  
  static final GoRouter router = GoRouter(
    initialLocation: splash,
    routes: [
      GoRoute(
        path: splash,
        builder: (context, state) => const SplashScreen(),
      ),
      GoRoute(
        path: login,
        builder: (context, state) => const LoginScreen(),
      ),
      GoRoute(
        path: register,
        builder: (context, state) => const RegisterScreen(),
      ),
      GoRoute(
        path: home,
        builder: (context, state) => const HomeScreen(),
      ),
      GoRoute(
        path: transactions,
        builder: (context, state) => const TransactionListScreen(),
      ),
      GoRoute(
        path: addTransaction,
        builder: (context, state) => const AddTransactionScreen(),
      ),
      GoRoute(
        path: accounts,
        builder: (context, state) => const AccountListScreen(),
      ),
      GoRoute(
        path: budgets,
        builder: (context, state) => const BudgetListScreen(),
      ),
      GoRoute(
        path: goals,
        builder: (context, state) => const GoalListScreen(),
      ),
      GoRoute(
        path: reports,
        builder: (context, state) => const ReportsScreen(),
      ),
      GoRoute(
        path: settings,
        builder: (context, state) => const SettingsScreen(),
      ),
    ],
  );
}
