import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

sealed class AppTheme {
  static final ColorScheme healthyScheme = ColorScheme.fromSeed(
    seedColor: const Color(0xFF2ECC71),
    brightness: Brightness.light,
  );

  static final ColorScheme alertScheme = ColorScheme.fromSeed(
    seedColor: const Color(0xFFF39C12),
    brightness: Brightness.light,
  );

  static final ColorScheme dangerScheme = ColorScheme.fromSeed(
    seedColor: const Color(0xFFE74C3C),
    brightness: Brightness.light,
  );

  static ThemeData _base(ColorScheme scheme, {Brightness? brightness}) {
    final textTheme = GoogleFonts.interTextTheme(
      ThemeData(brightness: brightness ?? scheme.brightness).textTheme,
    );

    return ThemeData(
      colorScheme: scheme,
      useMaterial3: true,
      textTheme: textTheme,
      appBarTheme: AppBarTheme(
        elevation: 0,
        backgroundColor: scheme.surface,
        foregroundColor: scheme.primary,
      ),
      cardTheme: CardTheme(
        elevation: 0,
        color: scheme.surfaceVariant.withOpacity(0.6),
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
      ),
    );
  }

  static ThemeData get light => _base(healthyScheme);
  static ThemeData get dark => _base(healthyScheme.copyWith(brightness: Brightness.dark), brightness: Brightness.dark);
}
