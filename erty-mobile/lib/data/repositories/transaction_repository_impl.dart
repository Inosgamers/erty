import '../../domain/entities/transaction.dart';
import '../../domain/repositories/transaction_repository.dart';
import '../datasources/remote/api_client.dart';
import '../datasources/local/local_storage.dart';

class TransactionRepositoryImpl implements TransactionRepository {
  final ApiClient _apiClient;
  final LocalStorage _localStorage;

  TransactionRepositoryImpl(this._apiClient, this._localStorage);

  @override
  Future<List<Transaction>> getTransactions({
    int page = 1,
    int limit = 50,
    TransactionType? type,
    String? categoryId,
    String? accountId,
    DateTime? startDate,
    DateTime? endDate,
  }) async {
    try {
      final response = await _apiClient.getTransactions(
        page: page,
        limit: limit,
        type: type?.name,
        categoryId: categoryId,
        accountId: accountId,
        startDate: startDate,
        endDate: endDate,
      );

      final List<dynamic> data = response.data['data']['transactions'];
      return data.map((json) => _mapToTransaction(json)).toList();
    } catch (e) {
      throw Exception('Erro ao buscar transações: $e');
    }
  }

  @override
  Future<Transaction> getTransaction(String id) async {
    try {
      final response = await _apiClient.getTransactions();
      final data = response.data['data'];
      return _mapToTransaction(data);
    } catch (e) {
      throw Exception('Erro ao buscar transação: $e');
    }
  }

  @override
  Future<Transaction> createTransaction(Transaction transaction) async {
    try {
      final response = await _apiClient.createTransaction({
        'accountId': transaction.accountId,
        'categoryId': transaction.categoryId,
        'type': transaction.type.name,
        'amount': transaction.amount,
        'currency': transaction.currency,
        'description': transaction.description,
        'date': transaction.date.toIso8601String(),
        'paymentMethod': transaction.paymentMethod,
        'tags': transaction.tags,
        'notes': transaction.notes,
      });

      final data = response.data['data'];
      return _mapToTransaction(data);
    } catch (e) {
      throw Exception('Erro ao criar transação: $e');
    }
  }

  @override
  Future<Transaction> updateTransaction(Transaction transaction) async {
    try {
      final response = await _apiClient.updateTransaction(
        transaction.id,
        {
          'accountId': transaction.accountId,
          'categoryId': transaction.categoryId,
          'type': transaction.type.name,
          'amount': transaction.amount,
          'description': transaction.description,
          'date': transaction.date.toIso8601String(),
          'paymentMethod': transaction.paymentMethod,
          'tags': transaction.tags,
          'notes': transaction.notes,
        },
      );

      final data = response.data['data'];
      return _mapToTransaction(data);
    } catch (e) {
      throw Exception('Erro ao atualizar transação: $e');
    }
  }

  @override
  Future<void> deleteTransaction(String id) async {
    try {
      await _apiClient.deleteTransaction(id);
    } catch (e) {
      throw Exception('Erro ao deletar transação: $e');
    }
  }

  @override
  Future<Map<String, dynamic>> getStatistics({
    DateTime? startDate,
    DateTime? endDate,
  }) async {
    try {
      final response = await _apiClient.getStatistics(
        startDate: startDate,
        endDate: endDate,
      );

      return response.data['data'];
    } catch (e) {
      throw Exception('Erro ao buscar estatísticas: $e');
    }
  }

  @override
  Future<void> syncTransactions() async {
    // Implement sync logic
    throw UnimplementedError();
  }

  @override
  Future<List<Transaction>> getPendingSyncTransactions() async {
    // Implement pending sync logic
    throw UnimplementedError();
  }

  Transaction _mapToTransaction(Map<String, dynamic> json) {
    return Transaction(
      id: json['id'],
      userId: json['userId'],
      accountId: json['accountId'],
      categoryId: json['categoryId'],
      type: TransactionType.values.firstWhere(
        (e) => e.name == json['type'],
        orElse: () => TransactionType.expense,
      ),
      amount: double.parse(json['amount'].toString()),
      currency: json['currency'] ?? 'AOA',
      description: json['description'],
      date: DateTime.parse(json['date']),
      paymentMethod: json['paymentMethod'] ?? 'cash',
      status: json['status'] ?? 'completed',
      tags: List<String>.from(json['tags'] ?? []),
      notes: json['notes'],
      isSynced: json['isSynced'] ?? true,
      localId: json['localId'],
    );
  }
}
