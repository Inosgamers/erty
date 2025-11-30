import '../../domain/entities/user.dart';
import '../../domain/repositories/auth_repository.dart';
import '../datasources/remote/api_client.dart';
import '../datasources/local/local_storage.dart';

class AuthRepositoryImpl implements AuthRepository {
  final ApiClient _apiClient;
  final LocalStorage _localStorage;

  AuthRepositoryImpl(this._apiClient, this._localStorage);

  @override
  Future<User> login(String email, String password) async {
    try {
      final response = await _apiClient.login(email, password);
      final data = response.data['data'];

      // Save tokens
      await _localStorage.saveAuthToken(data['token']);
      await _localStorage.saveRefreshToken(data['refreshToken']);
      await _localStorage.saveUserId(data['user']['id']);
      await _localStorage.saveUserData(data['user']);

      return _mapToUser(data['user']);
    } catch (e) {
      throw Exception('Erro ao fazer login: $e');
    }
  }

  @override
  Future<User> register(String name, String email, String password) async {
    try {
      final response = await _apiClient.register(name, email, password);
      final data = response.data['data'];

      // Save tokens
      await _localStorage.saveAuthToken(data['token']);
      await _localStorage.saveRefreshToken(data['refreshToken']);
      await _localStorage.saveUserId(data['user']['id']);
      await _localStorage.saveUserData(data['user']);

      return _mapToUser(data['user']);
    } catch (e) {
      throw Exception('Erro ao registrar: $e');
    }
  }

  @override
  Future<void> logout() async {
    try {
      await _apiClient.logout();
      await _localStorage.clearAuth();
    } catch (e) {
      // Clear local data even if API call fails
      await _localStorage.clearAuth();
    }
  }

  @override
  Future<User?> getCurrentUser() async {
    try {
      final userData = _localStorage.getUserData();
      if (userData != null) {
        return _mapToUser(userData);
      }

      // Fetch from API
      final response = await _apiClient.getMe();
      final data = response.data['data'];
      await _localStorage.saveUserData(data);
      return _mapToUser(data);
    } catch (e) {
      return null;
    }
  }

  @override
  Future<bool> isLoggedIn() async {
    final token = _localStorage.getAuthToken();
    return token != null && token.isNotEmpty;
  }

  @override
  Future<void> refreshToken() async {
    // Handled automatically in ApiClient interceptor
  }

  @override
  Future<void> updateProfile(User user) async {
    // Implement profile update
    throw UnimplementedError();
  }

  @override
  Future<void> changePassword(String currentPassword, String newPassword) async {
    // Implement password change
    throw UnimplementedError();
  }

  User _mapToUser(Map<String, dynamic> json) {
    return User(
      id: json['id'],
      name: json['name'],
      email: json['email'],
      phone: json['phone'],
      avatar: json['avatar'],
      currency: json['currency'] ?? 'AOA',
      language: json['language'] ?? 'pt',
      isPremium: json['isPremium'] ?? false,
      premiumUntil: json['premiumUntil'] != null
          ? DateTime.parse(json['premiumUntil'])
          : null,
      emailVerified: json['emailVerified'] ?? false,
      twoFactorEnabled: json['twoFactorEnabled'] ?? false,
      biometricEnabled: json['biometricEnabled'] ?? false,
    );
  }
}
