import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../insights/domain/insight.dart';

class DashboardPage extends ConsumerWidget {
  const DashboardPage({super.key});

  static const String routeName = 'dashboard';

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final insights = sampleInsights;

    return Scaffold(
      appBar: AppBar(
        title: const Text('Finanças em Ordem'),
        actions: [
          IconButton(
            onPressed: () {},
            icon: const Icon(Icons.notifications_outlined),
            tooltip: 'Notificações e lembretes',
          ),
        ],
      ),
      body: CustomScrollView(
        slivers: [
          const _HeadlineSection(),
          SliverPadding(
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
            sliver: SliverToBoxAdapter(
              child: Wrap(
                spacing: 16,
                runSpacing: 16,
                children: const [
                  _SummaryCard(
                    title: 'Saldo projetado',
                    value: '214.500 Kz',
                    subtitle: 'Previsão até 30 Nov',
                    trend: 0.12,
                  ),
                  _SummaryCard(
                    title: 'Orçamento vs Realizado',
                    value: '72% do limite',
                    subtitle: 'Risco médio',
                    trend: -0.05,
                  ),
                  _SummaryCard(
                    title: 'Metas ativas',
                    value: '3 em progresso',
                    subtitle: 'Meta próxima: Viagem Família',
                    trend: 0.31,
                  ),
                ],
              ),
            ),
          ),
          SliverPadding(
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
            sliver: SliverToBoxAdapter(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text('Insights FinAI', style: Theme.of(context).textTheme.titleMedium),
                  const SizedBox(height: 12),
                  ...insights.map((insight) => _InsightTile(insight: insight)),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
}

class _HeadlineSection extends StatelessWidget {
  const _HeadlineSection();

  @override
  Widget build(BuildContext context) {
    return const SliverToBoxAdapter(
      child: Padding(
        padding: EdgeInsets.fromLTRB(16, 12, 16, 4),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text('Olá, Marta', style: TextStyle(fontSize: 24, fontWeight: FontWeight.w600)),
            SizedBox(height: 4),
            Text('Seu assistente financeiro inteligente está atualizado.'),
          ],
        ),
      ),
    );
  }
}

class _SummaryCard extends StatelessWidget {
  const _SummaryCard({
    required this.title,
    required this.value,
    required this.subtitle,
    required this.trend,
  });

  final String title;
  final String value;
  final String subtitle;
  final double trend;

  IconData get _trendIcon => trend >= 0 ? Icons.trending_up : Icons.trending_down;
  Color _trendColor(BuildContext context) => trend >= 0 ? Theme.of(context).colorScheme.primary : Theme.of(context).colorScheme.error;

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      width: 320,
      child: Card(
        child: Padding(
          padding: const EdgeInsets.all(16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(title, style: Theme.of(context).textTheme.titleSmall),
              const SizedBox(height: 4),
              Text(value, style: Theme.of(context).textTheme.headlineSmall),
              const SizedBox(height: 8),
              Row(
                children: [
                  Icon(_trendIcon, size: 18, color: _trendColor(context)),
                  const SizedBox(width: 4),
                  Text(
                    trend >= 0 ? '+${(trend * 100).toStringAsFixed(0)}%' : '${(trend * 100).toStringAsFixed(0)}%',
                    style: TextStyle(color: _trendColor(context)),
                  ),
                  const SizedBox(width: 8),
                  Expanded(
                    child: Text(
                      subtitle,
                      maxLines: 2,
                      overflow: TextOverflow.ellipsis,
                    ),
                  ),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }
}

class _InsightTile extends StatelessWidget {
  const _InsightTile({required this.insight});

  final Insight insight;

  @override
  Widget build(BuildContext context) {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                Icon(insight.icon, color: insight.color, size: 32),
                const SizedBox(width: 12),
                Expanded(
                  child: Text(
                    insight.title,
                    style: Theme.of(context).textTheme.titleMedium,
                  ),
                ),
                Chip(label: Text(insight.severity.label)),
              ],
            ),
            const SizedBox(height: 8),
            Text(insight.description),
            if (insight.recommendation != null) ...[
              const SizedBox(height: 8),
              Text('Ação sugerida', style: Theme.of(context).textTheme.labelLarge),
              const SizedBox(height: 4),
              Text(insight.recommendation!),
            ],
          ],
        ),
      ),
    );
  }
}
