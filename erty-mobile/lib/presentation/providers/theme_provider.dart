import 'package:flutter/material.dart';
import '../../data/datasources/local/local_storage.dart';

class ThemeProvider extends ChangeNotifier {
  final LocalStorage _localStorage;
  ThemeMode _themeMode = ThemeMode.system;

  ThemeProvider(this._localStorage) {
    _loadThemeMode();
  }

  ThemeMode get themeMode => _themeMode;

  void _loadThemeMode() {
    final mode = _localStorage.getThemeMode();
    switch (mode) {
      case 'light':
        _themeMode = ThemeMode.light;
        break;
      case 'dark':
        _themeMode = ThemeMode.dark;
        break;
      default:
        _themeMode = ThemeMode.system;
    }
    notifyListeners();
  }

  Future<void> setThemeMode(ThemeMode mode) async {
    _themeMode = mode;
    await _localStorage.saveThemeMode(mode.name);
    notifyListeners();
  }

  Future<void> toggleTheme() async {
    if (_themeMode == ThemeMode.light) {
      await setThemeMode(ThemeMode.dark);
    } else {
      await setThemeMode(ThemeMode.light);
    }
  }
}
