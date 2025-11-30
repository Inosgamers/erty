import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

/// Representa o estado financeiro atual e influencia o tema dinâmico.
enum FinancialMood { healthy, attention, danger }

class AppThemeState {
  const AppThemeState({
    required this.light,
    required this.dark,
    required this.mode,
    required this.mood,
  });

  final ThemeData light;
  final ThemeData dark;
  final ThemeMode mode;
  final FinancialMood mood;

  AppThemeState copyWith({
    ThemeData? light,
    ThemeData? dark,
    ThemeMode? mode,
    FinancialMood? mood,
  }) {
    return AppThemeState(
      light: light ?? this.light,
      dark: dark ?? this.dark,
      mode: mode ?? this.mode,
      mood: mood ?? this.mood,
    );
  }
}

final appThemeProvider =
    StateNotifierProvider<AppThemeController, AppThemeState>((ref) {
  return AppThemeController();
});

class AppThemeController extends StateNotifier<AppThemeState> {
  AppThemeController()
      : super(
          AppThemeState(
            light: _buildLightTheme(FinancialMood.healthy),
            dark: _buildDarkTheme(),
            mode: ThemeMode.system,
            mood: FinancialMood.healthy,
          ),
        );

  void updateMood(FinancialMood mood) {
    state = state.copyWith(
      light: _buildLightTheme(mood),
      mood: mood,
    );
  }

  void updateMode(ThemeMode mode) {
    state = state.copyWith(mode: mode);
  }
}

ThemeData _buildLightTheme(FinancialMood mood) {
  final seed = switch (mood) {
    FinancialMood.healthy => const Color(0xFF1B998B),
    FinancialMood.attention => const Color(0xFFF0A500),
    FinancialMood.danger => const Color(0xFFC81D25),
  };

  final colorScheme = ColorScheme.fromSeed(
    seedColor: seed,
    brightness: Brightness.light,
  );

  return ThemeData(
    colorScheme: colorScheme,
    useMaterial3: true,
    appBarTheme: AppBarTheme(
      backgroundColor: colorScheme.surface,
      foregroundColor: colorScheme.onSurface,
      elevation: 0,
    ),
    scaffoldBackgroundColor: colorScheme.surface,
    cardTheme: CardTheme(
      color: colorScheme.surfaceVariant,
      elevation: 0,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(24)),
    ),
  );
}

ThemeData _buildDarkTheme() {
  final scheme = ColorScheme.fromSeed(
    seedColor: const Color(0xFF1B998B),
    brightness: Brightness.dark,
  );

  return ThemeData(
    colorScheme: scheme,
    useMaterial3: true,
    cardTheme: CardTheme(
      color: scheme.surfaceVariant,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(24)),
    ),
  );
}
