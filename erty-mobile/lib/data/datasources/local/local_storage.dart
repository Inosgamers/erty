import 'package:shared_preferences/shared_preferences.dart';
import 'dart:convert';

import '../../../core/config/app_config.dart';

class LocalStorage {
  final SharedPreferences _prefs;

  LocalStorage(this._prefs);

  // Authentication
  Future<void> saveAuthToken(String token) async {
    await _prefs.setString(AppConfig.keyAuthToken, token);
  }

  String? getAuthToken() {
    return _prefs.getString(AppConfig.keyAuthToken);
  }

  Future<void> saveRefreshToken(String token) async {
    await _prefs.setString(AppConfig.keyRefreshToken, token);
  }

  String? getRefreshToken() {
    return _prefs.getString(AppConfig.keyRefreshToken);
  }

  Future<void> saveUserId(String userId) async {
    await _prefs.setString(AppConfig.keyUserId, userId);
  }

  String? getUserId() {
    return _prefs.getString(AppConfig.keyUserId);
  }

  Future<void> saveUserData(Map<String, dynamic> userData) async {
    await _prefs.setString(AppConfig.keyUserData, json.encode(userData));
  }

  Map<String, dynamic>? getUserData() {
    final data = _prefs.getString(AppConfig.keyUserData);
    if (data != null) {
      return json.decode(data);
    }
    return null;
  }

  Future<void> clearAuth() async {
    await _prefs.remove(AppConfig.keyAuthToken);
    await _prefs.remove(AppConfig.keyRefreshToken);
    await _prefs.remove(AppConfig.keyUserId);
    await _prefs.remove(AppConfig.keyUserData);
  }

  // Sync
  Future<void> saveLastSyncTime(DateTime time) async {
    await _prefs.setString(AppConfig.keyLastSync, time.toIso8601String());
  }

  DateTime? getLastSyncTime() {
    final time = _prefs.getString(AppConfig.keyLastSync);
    if (time != null) {
      return DateTime.parse(time);
    }
    return null;
  }

  // Theme
  Future<void> saveThemeMode(String mode) async {
    await _prefs.setString(AppConfig.keyThemeMode, mode);
  }

  String getThemeMode() {
    return _prefs.getString(AppConfig.keyThemeMode) ?? 'system';
  }

  // Biometric
  Future<void> saveBiometricEnabled(bool enabled) async {
    await _prefs.setBool(AppConfig.keyBiometricEnabled, enabled);
  }

  bool getBiometricEnabled() {
    return _prefs.getBool(AppConfig.keyBiometricEnabled) ?? false;
  }

  // Generic
  Future<void> save(String key, String value) async {
    await _prefs.setString(key, value);
  }

  String? get(String key) {
    return _prefs.getString(key);
  }

  Future<void> remove(String key) async {
    await _prefs.remove(key);
  }

  Future<void> clear() async {
    await _prefs.clear();
  }
}
