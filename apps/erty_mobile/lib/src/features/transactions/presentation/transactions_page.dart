import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../core/offline/offline_sync_service.dart';
import '../application/transactions_controller.dart';
import '../domain/money_transaction.dart';

class TransactionsPage extends ConsumerWidget {
  const TransactionsPage({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final transactions = ref.watch(transactionsControllerProvider);

    return Scaffold(
      appBar: AppBar(title: const Text('Transações')),
      body: transactions.when(
        data: (items) => ListView.separated(
          padding: const EdgeInsets.all(16),
          itemBuilder: (_, index) {
            final tx = items[index];
            return ListTile(
              leading: CircleAvatar(
                backgroundColor:
                    tx.isExpense ? Colors.redAccent : Colors.greenAccent,
                child: Icon(
                  tx.isExpense ? Icons.arrow_upward : Icons.arrow_downward,
                  color: Colors.white,
                ),
              ),
              title: Text(tx.description),
              subtitle: Text('${tx.category} • ${tx.member}'),
              trailing: Column(
                crossAxisAlignment: CrossAxisAlignment.end,
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Text(
                    '${tx.isExpense ? '-' : '+'}${tx.amount.toStringAsFixed(2)} ${tx.currency}',
                    style: Theme.of(context).textTheme.titleMedium,
                  ),
                  Text(tx.accountName,
                      style: Theme.of(context).textTheme.bodySmall),
                ],
              ),
            );
          },
          separatorBuilder: (_, __) => const SizedBox(height: 12),
          itemCount: items.length,
        ),
        loading: () => const Center(child: CircularProgressIndicator()),
        error: (err, _) => Center(child: Text('Erro: $err')),
      ),
      floatingActionButton: FloatingActionButton.extended(
        onPressed: () => _addSampleTransaction(ref),
        label: const Text('Lançar gasto rápido'),
        icon: const Icon(Icons.flash_on),
      ),
    );
  }

  Future<void> _addSampleTransaction(WidgetRef ref) async {
    final controller = ref.read(transactionsControllerProvider.notifier);
    final offline = ref.read(offlineSyncServiceProvider);

    final transaction = MoneyTransaction(
      description: 'Delivery almoço',
      amount: 6500,
      currency: 'Kz',
      type: TransactionType.expense,
      category: 'Alimentação',
      performedAt: DateTime.now(),
      accountName: 'Conta Nubila',
      member: 'Família',
    );

    await controller.addTransaction(transaction);
    await offline.enqueueOperation(
      OfflineOperation(
        id: transaction.id,
        type: OfflineOperationType.expense,
        amount: transaction.amount,
        createdAt: DateTime.now(),
      ),
    );
  }
}
