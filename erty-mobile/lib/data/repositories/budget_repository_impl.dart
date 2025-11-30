import '../../domain/entities/budget.dart';
import '../../domain/repositories/budget_repository.dart';
import '../datasources/remote/api_client.dart';
import '../datasources/local/local_storage.dart';

class BudgetRepositoryImpl implements BudgetRepository {
  final ApiClient _apiClient;
  final LocalStorage _localStorage;

  BudgetRepositoryImpl(this._apiClient, this._localStorage);

  @override
  Future<List<Budget>> getBudgets() async {
    try {
      final response = await _apiClient.getBudgets();
      final List<dynamic> data = response.data['data'];
      return data.map((json) => _mapToBudget(json)).toList();
    } catch (e) {
      throw Exception('Erro ao buscar orçamentos: $e');
    }
  }

  @override
  Future<Budget> getBudget(String id) async {
    throw UnimplementedError();
  }

  @override
  Future<Budget> createBudget(Budget budget) async {
    try {
      final response = await _apiClient.createBudget({
        'name': budget.name,
        'categoryId': budget.categoryId,
        'amount': budget.amount,
        'period': budget.period.name,
        'startDate': budget.startDate.toIso8601String(),
        'endDate': budget.endDate.toIso8601String(),
        'alertThreshold': budget.alertThreshold,
        'color': budget.color,
      });

      final data = response.data['data'];
      return _mapToBudget(data);
    } catch (e) {
      throw Exception('Erro ao criar orçamento: $e');
    }
  }

  @override
  Future<Budget> updateBudget(Budget budget) async {
    try {
      final response = await _apiClient.updateBudget(budget.id, {
        'name': budget.name,
        'amount': budget.amount,
        'alertThreshold': budget.alertThreshold,
        'color': budget.color,
      });

      final data = response.data['data'];
      return _mapToBudget(data);
    } catch (e) {
      throw Exception('Erro ao atualizar orçamento: $e');
    }
  }

  @override
  Future<void> deleteBudget(String id) async {
    try {
      await _apiClient.deleteBudget(id);
    } catch (e) {
      throw Exception('Erro ao deletar orçamento: $e');
    }
  }

  @override
  Future<List<Map<String, dynamic>>> checkAlerts() async {
    throw UnimplementedError();
  }

  Budget _mapToBudget(Map<String, dynamic> json) {
    return Budget(
      id: json['id'],
      userId: json['userId'],
      categoryId: json['categoryId'],
      name: json['name'],
      amount: double.parse(json['amount'].toString()),
      period: BudgetPeriod.values.firstWhere(
        (e) => e.name == json['period'],
        orElse: () => BudgetPeriod.monthly,
      ),
      startDate: DateTime.parse(json['startDate']),
      endDate: DateTime.parse(json['endDate']),
      spent: double.parse(json['spent']?.toString() ?? '0'),
      alertThreshold: json['alertThreshold'] ?? 80,
      alertSent: json['alertSent'] ?? false,
      color: json['color'] ?? '#4CAF50',
    );
  }
}
