import { Router } from 'express';

export const insightsRouter = Router();

insightsRouter.get('/', (_req, res) => {
  res.json({
    insights: [
      {
        id: 'insight-1',
        type: 'waste-report',
        severity: 'medium',
        message: 'Gastos com streaming aumentaram 35% vs média trimestral.',
        suggestedAction: 'Revise assinaturas no painel FinAI.',
        factors: ['Streaming', 'Pagamentos recorrentes']
      },
      {
        id: 'insight-2',
        type: 'goal-projection',
        severity: 'low',
        message: 'Meta "Universidade" atingirá 95% em 4 meses ao ritmo atual.',
        suggestedAction: 'Ative aporte automático de 10.000 Kz para antecipar 1 mês.',
        factors: ['Metas', 'Poupança']
      }
    ]
  });
});
