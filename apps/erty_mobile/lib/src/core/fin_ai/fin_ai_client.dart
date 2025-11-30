import 'dart:async';
import 'dart:math';

import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../offline/offline_sync_service.dart';

final finAiClientProvider = Provider<FinAiClient>((ref) {
  return FinAiClient();
});

class FinAiClient {
  Future<FinAiInsight> generateInsight(OfflineSnapshot snapshot) async {
    await Future.delayed(const Duration(milliseconds: 380));

    final rand = Random(snapshot.projectedBalance.toInt());
    final wastePercent = (snapshot.wasteIndex * 100).clamp(0, 100).toStringAsFixed(1);

    final actions = <String>[
      'Reduza em 12% assinaturas recreativas para economizar Kz 25.000/mês',
      'Ative a poupança automática de 5% do salário no dia 25',
      if (snapshot.pendingOperations > 0)
        'Sincronize ${snapshot.pendingOperations} lançamentos offline para consolidar o relatório',
    ];

    if (rand.nextBool()) {
      actions.add('Avalie migrar despesas do cartão XPTO para débito direto com cashback 2%');
    }

    final headline = switch (snapshot.mood) {
      FinancialMood.healthy => 'Situação saudável, continue reforçando a reserva.',
      FinancialMood.attention => 'Momento de atenção: otimize orçamentos críticos.',
      FinancialMood.danger => 'Alerta vermelho: ajuste gastos e negocie dívidas.',
    };

    final narrative =
        'Seu índice de desperdício está em $wastePercent%. Foque nas categorias lazer e delivery nas próximas duas semanas.';

    return FinAiInsight(
      headline: headline,
      narrative: narrative,
      actionableTips: actions,
    );
  }
}

class FinAiInsight {
  const FinAiInsight({
    required this.headline,
    required this.narrative,
    required this.actionableTips,
  });

  final String headline;
  final String narrative;
  final List<String> actionableTips;
}
