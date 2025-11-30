import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../config/theme.dart';
import '../../../core/fin_ai/fin_ai_client.dart';
import '../../../core/offline/offline_sync_service.dart';

final dashboardSummaryProvider =
    AutoDisposeFutureProvider<DashboardSummary>((ref) async {
  final offline = ref.read(offlineSyncServiceProvider);
  final finAi = ref.read(finAiClientProvider);
  final theme = ref.read(appThemeProvider.notifier);

  final snapshot = await offline.summarize();
  theme.updateMood(snapshot.mood);
  final insight = await finAi.generateInsight(snapshot);

  return DashboardSummary(
    income: snapshot.totalIncome,
    expenses: snapshot.totalExpenses,
    projectedBalance: snapshot.projectedBalance,
    goalsProgress: snapshot.goalsProgress,
    householdMembers: snapshot.householdMembers,
    pendingOperations: snapshot.pendingOperations,
    mood: snapshot.mood,
    finAiInsight: insight,
    wasteIndex: snapshot.wasteIndex,
  );
});

class DashboardPage extends ConsumerWidget {
  const DashboardPage({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final summary = ref.watch(dashboardSummaryProvider);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Erty'),
        actions: const [Icon(Icons.notifications_outlined)],
      ),
      body: RefreshIndicator(
        onRefresh: () => ref.refresh(dashboardSummaryProvider.future),
        child: summary.when(
          data: (data) => ListView(
            padding: const EdgeInsets.all(16),
            children: [
              _MoodHeader(data: data),
              const SizedBox(height: 16),
              _BalanceRow(data: data),
              const SizedBox(height: 16),
              _GoalsCard(progress: data.goalsProgress),
              const SizedBox(height: 16),
              _FinAiCard(insight: data.finAiInsight),
            ],
          ),
          loading: () => const Center(child: CircularProgressIndicator()),
          error: (err, _) => Center(
            child: Text('Erro ao carregar dashboard: $err'),
          ),
        ),
      ),
    );
  }
}

class _MoodHeader extends StatelessWidget {
  const _MoodHeader({required this.data});

  final DashboardSummary data;

  @override
  Widget build(BuildContext context) {
    final color = switch (data.mood) {
      FinancialMood.healthy => Colors.green,
      FinancialMood.attention => Colors.amber,
      FinancialMood.danger => Colors.red,
    };

    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: color.withOpacity(0.1),
        borderRadius: BorderRadius.circular(24),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text('Humor financeiro', style: Theme.of(context).textTheme.labelLarge),
          const SizedBox(height: 8),
          Row(
            children: [
              Icon(Icons.eco, color: color),
              const SizedBox(width: 8),
              Text(
                data.mood.name,
                style: Theme.of(context)
                    .textTheme
                    .headlineSmall
                    ?.copyWith(color: color),
              ),
              const Spacer(),
              Text('${data.householdMembers} membros'),
            ],
          ),
          const SizedBox(height: 12),
          Text('Operações offline pendentes: ${data.pendingOperations}'),
        ],
      ),
    );
  }
}

class _BalanceRow extends StatelessWidget {
  const _BalanceRow({required this.data});

  final DashboardSummary data;

  @override
  Widget build(BuildContext context) {
    return Row(
      children: [
        Expanded(
          child: _SummaryCard(
            title: 'Receitas',
            value: data.income,
            icon: Icons.arrow_downward,
            color: Colors.green,
          ),
        ),
        const SizedBox(width: 12),
        Expanded(
          child: _SummaryCard(
            title: 'Despesas',
            value: data.expenses,
            icon: Icons.arrow_upward,
            color: Colors.red,
          ),
        ),
      ],
    );
  }
}

class _SummaryCard extends StatelessWidget {
  const _SummaryCard({
    required this.title,
    required this.value,
    required this.icon,
    required this.color,
  });

  final String title;
  final double value;
  final IconData icon;
  final Color color;

  @override
  Widget build(BuildContext context) {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Icon(icon, color: color),
            const SizedBox(height: 8),
            Text(title, style: Theme.of(context).textTheme.labelLarge),
            const SizedBox(height: 8),
            Text(
              'Kz ${value.toStringAsFixed(2)}',
              style: Theme.of(context)
                  .textTheme
                  .titleLarge
                  ?.copyWith(color: color),
            ),
          ],
        ),
      ),
    );
  }
}

class _GoalsCard extends StatelessWidget {
  const _GoalsCard({required this.progress});

  final double progress;

  @override
  Widget build(BuildContext context) {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text('Metas financeiras', style: Theme.of(context).textTheme.titleMedium),
            const SizedBox(height: 12),
            LinearProgressIndicator(value: progress),
            const SizedBox(height: 8),
            Text('Meta anual concluída ${(progress * 100).toStringAsFixed(0)}%'),
          ],
        ),
      ),
    );
  }
}

class _FinAiCard extends StatelessWidget {
  const _FinAiCard({required this.insight});

  final FinAiInsight insight;

  @override
  Widget build(BuildContext context) {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text('FinAI', style: Theme.of(context).textTheme.labelLarge),
            const SizedBox(height: 8),
            Text(insight.headline, style: Theme.of(context).textTheme.titleMedium),
            const SizedBox(height: 8),
            Text(insight.narrative),
            const SizedBox(height: 12),
            ...insight.actionableTips.map(
              (tip) => Padding(
                padding: const EdgeInsets.symmetric(vertical: 4),
                child: Row(
                  children: [
                    const Icon(Icons.check_circle_outline, size: 16),
                    const SizedBox(width: 8),
                    Expanded(child: Text(tip)),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class DashboardSummary {
  const DashboardSummary({
    required this.income,
    required this.expenses,
    required this.projectedBalance,
    required this.goalsProgress,
    required this.householdMembers,
    required this.pendingOperations,
    required this.mood,
    required this.finAiInsight,
    required this.wasteIndex,
  });

  final double income;
  final double expenses;
  final double projectedBalance;
  final double goalsProgress;
  final int householdMembers;
  final int pendingOperations;
  final FinancialMood mood;
  final FinAiInsight finAiInsight;
  final double wasteIndex;
}
