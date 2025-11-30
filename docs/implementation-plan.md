# Plano de Implementação – Erty (Finanças em Ordem)

## 1. Estratégia Geral
- **Abordagem:** entregas incrementais com marcos trimestrais, priorizando MVP offline-first e recursos premium financiadores.
- **Metodologia:** Scrum/Kanban híbrido, squads funcionais (App, Core Finance, IA/Insights, Plataforma/DevOps).
- **OKRs chave:**
  - Onboarding < 3 min, retenção D30 > 45%.
  - Precisão das recomendações FinAI > 70% (feedback positivo).
  - Latência média API < 250 ms, disponibilidade 99.5%.

## 2. Fases de Entrega
| Fase | Duração | Objetivos |
| ---- | ------- | --------- |
| Fase 0 – Fundamentos | Semanas 1-3 | Setup repositórios, CI/CD, design system, esqueleto Flutter, boilerplate API, automação de segurança básica. |
| Fase 1 – MVP Financeiro | Semanas 4-12 | Cadastro/Login (2FA), transações, categorias, múltiplas moedas, orçamentos simples, metas, FinAI básico (insights de gastos), modo offline Isar, exportação CSV, notificações push. |
| Fase 2 – Premium & Família | Semanas 13-22 | Gestão familiar completa, perfis e aprovações, relatórios avançados, investimentos e patrimônio, IA com previsões, assinatura in-app, recursos premium no backend. |
| Fase 3 – Integrações & Escala | Semanas 23-36 | Preparar conectores bancários (mock + OFX), conciliação automática, infraestrutura multi-região, automação anti-fraude, parcerias comerciais. |
| Fase 4 – Expansão PALOP | Semanas 37-48 | Localização cultural e monetária, campanhas growth, novos modelos FinAI (idiomas, educação financeira), hardening de segurança e compliance. |

## 3. Backlog Temático (alto nível)
### 3.1 Experiência do Usuário
- Design System Material You (cores dinâmicas por saúde financeira).
- Dashboard com KPIs (saldo, orçamento vs realizado, metas, insights).
- Fluxos acessíveis (voz, alto contraste, fontes escaláveis).

### 3.2 Core Financeiro
- CRUD de transações (despesa, receita, transferência) com anexos.
- Filtros avançados (por pessoa, conta, método, moeda, tags).
- Orçamentos por categoria e período com alertas.
- Metas com linha do tempo e recomendações.
- Investimentos: registro, cálculo de rentabilidade, projeções.

### 3.3 IA & Análises
- Pipelines de features anonimizadas.
- Modelos FinAI embarcados (gastos anormais, previsão saldo, cluster hábitos).
- Explicações de insights (fatores chave em linguagem natural).
- Relatórios inteligentes: desperdício, orçamento vs realizado, comparativos mês a mês.

### 3.4 Multiusuário & Colaboração
- Household, convites, papéis (viewer, editor, approver, admin).
- Aprovação de despesas e notificações direcionadas.
- Perfis individuais e visão consolidada.

### 3.5 Offline & Sync
- Camada local (Isar) com enfileiramento de mutações.
- Replays resilientes, compressão, reconciliação por versão.
- Testes de falhas (modo avião, conexões instáveis).

### 3.6 Segurança & Privacidade
- 2FA (e-mail/SMS) + biometria.
- Criptografia local AES-256, TLS 1.2+, pinning opcional.
- Auditoria, consentimento, políticas LGPD/lei angolana.

### 3.7 Plataforma & DevOps
- Monorepo com workspaces (mobile/backend/docs).
- GitHub Actions: lint/test/build/deploy.
- Observabilidade (Sentry, OpenTelemetry, Grafana dashboards).
- Backups automáticos, testes E2E (Flutter integration + Postman collections).

## 4. Entregáveis por Squad
| Squad | Entregáveis principais |
| ----- | --------------------- |
| Mobile | App Flutter, UI responsiva, offline cache, notificações, FinAI local, testes widget/E2E. |
| Backend | APIs REST, autenticação, serviços financeiros, exportações, assinaturas, Webhooks. |
| AI/Insights | Pipelines de dados, modelos, explainability, dashboard de monitoramento de qualidade. |
| Plataforma | CI/CD, infraestrutura (Docker, Terraform), segurança, observabilidade, integrações externas. |

## 5. Plano de Qualidade
- **Testes automatizados:** unidade (>=80% crítico), widget/instrumentados, API (Jest/Supertest), contratos (Pact), E2E (Flutter Driver / Maestro + Newman).
- **Revisões:** code review obrigatório, lint/format, SAST (Semgrep), DAST (OWASP ZAP pipeline).
- **Observabilidade:** métricas chave (latência, taxa de erro, uso offline), tracing distribuído.

## 6. Gestão de Riscos
| Risco | Mitigação |
| ----- | --------- |
| Complexidade do modo offline | Prototipar cedo, testes de caos de rede, métricas de reconciliação. |
| Conformidade LGPD/Lei angolana | Consultoria jurídica, revisão de políticas, anonimização by default. |
| Escassez de dados para IA | Bootstrapping com dados simulados, learning feedback manual, programas beta. |
| Integrações bancárias diversas | Arquitetura com adaptadores, uso de padrões OFX/PSD2, fase de homologação longa. |

## 7. Indicadores de Sucesso
- Engajamento (MAU, retenção D30, tempo em modo offline vs online).
- Saúde financeira do usuário (taxa de metas cumpridas, redução média de gastos alvo).
- Precisão de insights (feedback positivo, taxa de abertura de recomendações > 60%).
- Confiabilidade (SLO cumpridos, falhas de sync < 0.2% das mutações).

Este plano serve como guia operacional para construir e evoluir o Erty de forma iterativa, cobrindo funcionalidades core, diferenciais com IA e requisitos de segurança.
