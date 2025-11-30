import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../features/dashboard/presentation/dashboard_page.dart';
import '../features/transactions/presentation/transactions_page.dart';

class ErtyRoutes {
  static const dashboard = 'dashboard';
  static const transactions = 'transactions';
}

final appRouterProvider = Provider<GoRouter>((ref) {
  return GoRouter(
    initialLocation: '/',
    routes: [
      GoRoute(
        path: '/',
        name: ErtyRoutes.dashboard,
        builder: (context, state) => const DashboardPage(),
      ),
      GoRoute(
        path: '/transactions',
        name: ErtyRoutes.transactions,
        builder: (context, state) => const TransactionsPage(),
      ),
    ],
    observers: [
      GoRouterObserver(reporter: NavigatorReporter(ref.read)),
    ],
    debugLogDiagnostics: false,
  );
});

class NavigatorReporter {
  NavigatorReporter(this.read);

  final Reader read;

  void track(String routeName) {
    // TODO(analytics): enviar evento para GA/Sentry.
  }
}

class GoRouterObserver extends NavigatorObserver {
  GoRouterObserver({required this.reporter});

  final NavigatorReporter reporter;

  @override
  void didPush(Route<dynamic> route, Route<dynamic>? previousRoute) {
    if (route.settings.name != null) {
      reporter.track(route.settings.name!);
    }
  }
}
