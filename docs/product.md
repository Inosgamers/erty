# Erty – Documento de Produto

## 1. Proposta de Valor
Erty (Finanças em Ordem) é um assistente financeiro inteligente para famílias e pequenos empreendedores nos PALOP. O app oferece registro de despesas/receitas, planejamento colaborativo, IA explicativa e sincronização offline → nuvem.

## 2. Público-Alvo
- Jovens adultos conectados que desejam controle de gastos.
- Famílias e casais que precisam de transparência e aprovação conjunta.
- Microempreendedores que misturam despesas pessoais e do negócio.

## 3. Funcionalidades Principais
1. **Gestão Financeira Multimoeda** – despesas/receitas com filtros por pessoa, categoria, conta ou método de pagamento. Importação/exportação CSV/Excel.
2. **Orçamentos Dinâmicos** – limites mensais ou por categoria com alertas automáticos ao ultrapassar 80%/100%.
3. **Metas e Linha do Tempo** – metas de poupança/investimento com recomendação automática de ajustes.
4. **Investimentos & Patrimônio** – carteira manual (poupança, ações, obrigações), cálculo de rentabilidade e projeções.
5. **Gestão Familiar** – perfis com permissões (visualizar, editar, aprovar). Feed com aprovações pendentes.
6. **Relatórios Inteligentes** – storytelling financeiro, comparativo mensal, "relatório de desperdício" (outliers) e "orçamento vs realizado".
7. **FinAI** – recomendações personalizadas (reduzir assinaturas, ativar poupança automática, renegociar dívidas) com explicação textual.
8. **Notificações e Lembretes** – push/e-mail/SMS para pagamentos, metas, sincronização offline pendente e alertas de risco.
9. **Modo Offline com Sincronização Automática** – lançamentos funcionam sem internet. Quando a conectividade retorna, o app envia a fila de operações para o backend que reconcilia conflitos (última atualização + diff amigável).
10. **Integração Bancária (Roadmap)** – leitura de extratos OFX/CSV, conciliação automática com contas locais (BAI, BFA, Atlântico) e APIs Open Finance quando estiverem disponíveis.

## 4. Fluxo Resumido do Usuário
1. Onboarding com idioma + moeda base + importação de transações (CSV) opcional.
2. Conexão com membros da família via convite (link mágico + 2FA).
3. Dashboard responde com tema baseado no humor financeiro (verde, amarelo, vermelho).
4. Usuário lança transações, agenda metas e recebe sugestões FinAI.
5. Quando offline, operações ficam em espera; ao voltar a rede, o backend confirma e envia notificação do status.
6. Relatórios mensais e insights explicativos entregues via push/e-mail.

## 5. Segurança e Privacidade
- Autenticação com Firebase Auth + MFA (e-mail, SMS ou TOTP).
- Suporte a biometria/PIN e criptografia local AES-256 para banco offline.
- API com TLS 1.3, JWT assinado (RS256), verificação de dispositivo e política anti-clonagem.
- Logs imutáveis (AuditLog) e políticas LGPD / Lei 22/11 (consentimento, portabilidade, deleção).
- Backups automáticos (Postgres, Firestore, Storage) + testes de restauração trimestrais.

## 6. Arquitetura Resumida
- **Frontend**: Flutter + Riverpod + Drift + IA on-device (TensorFlow Lite).
- **Backend**: Node.js, Express, PostgreSQL, Firestore (espelho), BullMQ, Redis.
- **IA**: serviço FinAI (FastAPI/TensorFlow) + modelos leves on-device para scoring rápido.
- **Infra**: Docker, GitHub Actions, Cloud Run/Kubernetes, GCS/S3 para arquivos.

## 7. Roadmap Sugerido
| Horizonte | Entregas |
| --- | --- |
| T1 (0-3 meses) | MVP: cadastro, transações básicas, budgets simples, FinAI heurístico, offline local. |
| T2 (3-6 meses) | Gestão familiar, notificações inteligentes, metas avançadas, relatórios interativos, sincronização completa. |
| T3 (6-9 meses) | Investimentos, IA preditiva, integrações bancárias piloto, assinaturas premium. |
| T4 (9-12 meses) | Automação de pagamentos, marketplace financeiro, parcerias e APIs abertas para terceiros. |

## 8. Modelo de Negócio
- **Freemium**: funcionalidades básicas gratuitas.
- **Premium**: IA avançada, relatórios detalhados, multiusuários ilimitados, integração bancária.
- **Parcerias**: bancos, corretoras e hubs educacionais.
- **Ads Contextuais**: anúncios leves e personalizáveis.

## 9. KPIs e Métricas
- Retenção D30/D90, churn premium, meta de receita MRR.
- Nível de adoção do modo offline (usuários com sync bem-sucedido/total offline).
- Índice de aproveitamento FinAI (ações concluídas por recomendação).
- Taxa de conciliação bancária automática.
- SLA de sincronização (<5 segundos em média quando online).

## 10. Backlog Técnico prioritário
1. Pipeline CI/CD com testes e lint automáticos.
2. Implementação do motor de regras (alertas, budgets, assinaturas).
3. Serviço FinAI escalável (explicabilidade + feedback do usuário).
4. Hardening de segurança (device fingerprint, detecção de anomalias, auditoria LGPD).
5. SDK de integração bancária (abstração por adaptadores, suporte OFX/CSV/Open Finance).
