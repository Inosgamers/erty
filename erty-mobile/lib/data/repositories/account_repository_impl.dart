import '../../domain/entities/account.dart';
import '../../domain/repositories/account_repository.dart';
import '../datasources/remote/api_client.dart';
import '../datasources/local/local_storage.dart';

class AccountRepositoryImpl implements AccountRepository {
  final ApiClient _apiClient;
  final LocalStorage _localStorage;

  AccountRepositoryImpl(this._apiClient, this._localStorage);

  @override
  Future<List<Account>> getAccounts() async {
    try {
      final response = await _apiClient.getAccounts();
      final data = response.data['data'];
      final List<dynamic> accounts = data['accounts'];
      return accounts.map((json) => _mapToAccount(json)).toList();
    } catch (e) {
      throw Exception('Erro ao buscar contas: $e');
    }
  }

  @override
  Future<Account> getAccount(String id) async {
    throw UnimplementedError();
  }

  @override
  Future<Account> createAccount(Account account) async {
    try {
      final response = await _apiClient.createAccount({
        'name': account.name,
        'type': account.type.name,
        'currency': account.currency,
        'initialBalance': account.initialBalance,
        'institution': account.institution,
        'accountNumber': account.accountNumber,
        'color': account.color,
        'icon': account.icon,
      });

      final data = response.data['data'];
      return _mapToAccount(data);
    } catch (e) {
      throw Exception('Erro ao criar conta: $e');
    }
  }

  @override
  Future<Account> updateAccount(Account account) async {
    try {
      final response = await _apiClient.updateAccount(account.id, {
        'name': account.name,
        'type': account.type.name,
        'institution': account.institution,
        'accountNumber': account.accountNumber,
        'color': account.color,
        'icon': account.icon,
      });

      final data = response.data['data'];
      return _mapToAccount(data);
    } catch (e) {
      throw Exception('Erro ao atualizar conta: $e');
    }
  }

  @override
  Future<void> deleteAccount(String id) async {
    try {
      await _apiClient.deleteAccount(id);
    } catch (e) {
      throw Exception('Erro ao deletar conta: $e');
    }
  }

  @override
  Future<double> getTotalBalance() async {
    try {
      final accounts = await getAccounts();
      return accounts
          .where((acc) => acc.includeInTotal)
          .fold(0.0, (sum, acc) => sum + acc.currentBalance);
    } catch (e) {
      throw Exception('Erro ao calcular saldo total: $e');
    }
  }

  Account _mapToAccount(Map<String, dynamic> json) {
    return Account(
      id: json['id'],
      userId: json['userId'],
      name: json['name'],
      type: AccountType.values.firstWhere(
        (e) => e.name == json['type'],
        orElse: () => AccountType.checking,
      ),
      currency: json['currency'] ?? 'AOA',
      initialBalance: double.parse(json['initialBalance'].toString()),
      currentBalance: double.parse(json['currentBalance'].toString()),
      institution: json['institution'],
      accountNumber: json['accountNumber'],
      color: json['color'] ?? '#2196F3',
      icon: json['icon'] ?? 'account_balance',
      isDefault: json['isDefault'] ?? false,
      includeInTotal: json['includeInTotal'] ?? true,
    );
  }
}
