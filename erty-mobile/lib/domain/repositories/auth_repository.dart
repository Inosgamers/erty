import '../entities/user.dart';

abstract class AuthRepository {
  Future<User> login(String email, String password);
  Future<User> register(String name, String email, String password);
  Future<void> logout();
  Future<User?> getCurrentUser();
  Future<bool> isLoggedIn();
  Future<void> refreshToken();
  Future<void> updateProfile(User user);
  Future<void> changePassword(String currentPassword, String newPassword);
}
