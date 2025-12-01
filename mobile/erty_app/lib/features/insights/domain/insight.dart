import 'package:flutter/material.dart';

enum InsightSeverity { low, medium, high }

extension InsightSeverityLabel on InsightSeverity {
  String get label => switch (this) {
        InsightSeverity.low => 'Saudável',
        InsightSeverity.medium => 'Atenção',
        InsightSeverity.high => 'Alerta',
      };
}

class Insight {
  Insight({
    required this.title,
    required this.description,
    required this.severity,
    this.recommendation,
    this.icon = Icons.auto_graph,
    this.color,
  });

  final String title;
  final String description;
  final InsightSeverity severity;
  final String? recommendation;
  final IconData icon;
  final Color? color;
}

final sampleInsights = <Insight>[
  Insight(
    title: 'Assinaturas pouco usadas',
    description: 'A Netflix e dois outros serviços foram usados < 2x neste mês.',
    recommendation: 'Considere pausar a Netflix e migrar para um plano compartilhado.',
    severity: InsightSeverity.medium,
    icon: Icons.subscriptions_outlined,
    color: Colors.amber,
  ),
  Insight(
    title: 'Poupança automática sugerida',
    description: 'Seu saldo médio permite guardar 15.000 Kz sem afetar o fluxo.',
    recommendation: 'Ative a poupança automática no dia 5 para evitar choque de contas.',
    severity: InsightSeverity.low,
    icon: Icons.savings_outlined,
    color: Colors.green,
  ),
  Insight(
    title: 'Despesa fora da média',
    description: 'Gastos em restaurantes estão 42% acima da média trimestral.',
    recommendation: 'Defina um teto semanal de 25.000 Kz e ative alertas em tempo real.',
    severity: InsightSeverity.high,
    icon: Icons.warning_amber_rounded,
    color: Colors.redAccent,
  ),
];
