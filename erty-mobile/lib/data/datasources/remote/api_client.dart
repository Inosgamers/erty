import 'package:dio/dio.dart';
import '../local/local_storage.dart';

class ApiClient {
  final Dio _dio;
  final LocalStorage _localStorage;

  ApiClient(this._dio, this._localStorage) {
    _dio.interceptors.add(
      InterceptorsWrapper(
        onRequest: (options, handler) async {
          // Add auth token to headers
          final token = _localStorage.getAuthToken();
          if (token != null) {
            options.headers['Authorization'] = 'Bearer $token';
          }
          return handler.next(options);
        },
        onError: (DioException error, handler) async {
          // Handle 401 (Unauthorized) - refresh token
          if (error.response?.statusCode == 401) {
            final refreshToken = _localStorage.getRefreshToken();
            if (refreshToken != null) {
              try {
                // Attempt to refresh token
                final response = await _dio.post(
                  '/auth/refresh-token',
                  data: {'refreshToken': refreshToken},
                );

                final newToken = response.data['data']['token'];
                final newRefreshToken = response.data['data']['refreshToken'];

                await _localStorage.saveAuthToken(newToken);
                await _localStorage.saveRefreshToken(newRefreshToken);

                // Retry original request
                error.requestOptions.headers['Authorization'] = 'Bearer $newToken';
                final cloneReq = await _dio.request(
                  error.requestOptions.path,
                  options: Options(
                    method: error.requestOptions.method,
                    headers: error.requestOptions.headers,
                  ),
                  data: error.requestOptions.data,
                  queryParameters: error.requestOptions.queryParameters,
                );

                return handler.resolve(cloneReq);
              } catch (e) {
                // Refresh failed - logout user
                await _localStorage.clearAuth();
                return handler.reject(error);
              }
            }
          }
          return handler.next(error);
        },
      ),
    );
  }

  // Auth
  Future<Response> login(String email, String password) async {
    return await _dio.post('/auth/login', data: {
      'email': email,
      'password': password,
    });
  }

  Future<Response> register(String name, String email, String password) async {
    return await _dio.post('/auth/register', data: {
      'name': name,
      'email': email,
      'password': password,
    });
  }

  Future<Response> logout() async {
    return await _dio.post('/auth/logout');
  }

  Future<Response> getMe() async {
    return await _dio.get('/auth/me');
  }

  // Transactions
  Future<Response> getTransactions({
    int page = 1,
    int limit = 50,
    String? type,
    String? categoryId,
    String? accountId,
    DateTime? startDate,
    DateTime? endDate,
  }) async {
    return await _dio.get('/transactions', queryParameters: {
      'page': page,
      'limit': limit,
      if (type != null) 'type': type,
      if (categoryId != null) 'categoryId': categoryId,
      if (accountId != null) 'accountId': accountId,
      if (startDate != null) 'startDate': startDate.toIso8601String(),
      if (endDate != null) 'endDate': endDate.toIso8601String(),
    });
  }

  Future<Response> createTransaction(Map<String, dynamic> data) async {
    return await _dio.post('/transactions', data: data);
  }

  Future<Response> updateTransaction(String id, Map<String, dynamic> data) async {
    return await _dio.patch('/transactions/$id', data: data);
  }

  Future<Response> deleteTransaction(String id) async {
    return await _dio.delete('/transactions/$id');
  }

  Future<Response> getStatistics({DateTime? startDate, DateTime? endDate}) async {
    return await _dio.get('/transactions/statistics', queryParameters: {
      if (startDate != null) 'startDate': startDate.toIso8601String(),
      if (endDate != null) 'endDate': endDate.toIso8601String(),
    });
  }

  // Accounts
  Future<Response> getAccounts() async {
    return await _dio.get('/accounts');
  }

  Future<Response> createAccount(Map<String, dynamic> data) async {
    return await _dio.post('/accounts', data: data);
  }

  Future<Response> updateAccount(String id, Map<String, dynamic> data) async {
    return await _dio.patch('/accounts/$id', data: data);
  }

  Future<Response> deleteAccount(String id) async {
    return await _dio.delete('/accounts/$id');
  }

  // Budgets
  Future<Response> getBudgets() async {
    return await _dio.get('/budgets');
  }

  Future<Response> createBudget(Map<String, dynamic> data) async {
    return await _dio.post('/budgets', data: data);
  }

  Future<Response> updateBudget(String id, Map<String, dynamic> data) async {
    return await _dio.patch('/budgets/$id', data: data);
  }

  Future<Response> deleteBudget(String id) async {
    return await _dio.delete('/budgets/$id');
  }

  // Sync
  Future<Response> syncTransactions(List<Map<String, dynamic>> transactions) async {
    return await _dio.post('/sync/transactions', data: {
      'transactions': transactions,
    });
  }

  Future<Response> getUpdates(DateTime lastSyncTime) async {
    return await _dio.get('/sync/updates', queryParameters: {
      'lastSyncTime': lastSyncTime.toIso8601String(),
    });
  }

  // AI
  Future<Response> getAIInsights({int months = 3}) async {
    return await _dio.get('/ai/insights', queryParameters: {
      'months': months,
    });
  }

  Future<Response> getRecommendations() async {
    return await _dio.get('/ai/recommendations');
  }
}
