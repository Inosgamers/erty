import { randomInt } from 'crypto';

export interface InsightPayload {
  householdId: string;
  wasteIndex: number;
}

export interface InsightRecommendation {
  mood: 'healthy' | 'attention' | 'danger';
  headline: string;
  narrative: string;
  actions: string[];
}

export async function generateInsight(
  payload: InsightPayload,
): Promise<InsightRecommendation> {
  const mood = payload.wasteIndex < 0.3 ? 'healthy' : payload.wasteIndex < 0.5 ? 'attention' : 'danger';
  const headline =
    mood === 'healthy'
      ? 'Gastos sob controle, continue investindo.'
      : mood === 'attention'
          ? 'Ajuste assinaturas e delivery esta semana.'
          : 'Risco alto: reduza despesas imediatas.';

  const actions = [
    'Revise assinaturas duplicadas e negocie novos pacotes.',
    'Programe transferência automática para a reserva de emergência.',
  ];

  if (randomInt(0, 10) > 5) {
    actions.push('Simule migrar dívidas rotativas para crédito consignado.');
  }

  return {
    mood,
    headline,
    narrative: `O índice de desperdício está em ${(payload.wasteIndex * 100).toFixed(1)}%.`,
    actions,
  };
}
