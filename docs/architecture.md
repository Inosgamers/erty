# Arquitetura Técnica – Erty (Finanças em Ordem)

## 1. Visão Geral
Erty é um ecossistema financeiro composto por três camadas principais:
1. **Aplicativo móvel Flutter (Android/iOS/Web)** – UI responsiva (Material You 3.0), modo offline e sincronização inteligente.
2. **Plataforma de serviços** – API REST/GraphQL em Node.js (Express + TypeScript), filas de eventos e microserviços de IA.
3. **Infraestrutura Cloud híbrida** – Firebase (Auth, Firestore, Cloud Messaging) + PostgreSQL gerenciado + armazenamento GCS/S3.

O objetivo é combinar educação financeira, automatização de decisões e colaboração familiar em um único produto freemium.

## 2. Stack Tecnológica Recomendada
| Camada | Escolhas | Justificativa |
| --- | --- | --- |
| Mobile | Flutter 3.24 (Material 3, Riverpod, Drift, Isar) | Multiplataforma, animações nativas e suporte offline.
| Sincronização Offline | `drift` + `isar` + `background_fetch` | Banco local reativo + jobs em segundo plano.
| Backend | Node.js 20, Express, TypeScript, Prisma ORM | Produtividade, typings, integrações rápidas.
| Banco Transacional | PostgreSQL 15 (Cloud SQL/Aurora) | ACID, JSONB, partições por organização.
| Banco Reativo | Firebase Firestore | Sincronização em tempo real para dashboards e notificações.
| Autenticação | Firebase Auth + WebAuthn/biometria + JWT assinado (RS256) | Login federado, MFA e integração móvel.
| IA Financeira | TensorFlow Lite (on-device) + microserviço FinAI (Python FastAPI) | Recomendações privadas no device e modelos pesados na nuvem.
| Observabilidade | Sentry, OpenTelemetry, Grafana | Erros, traços e KPIs de finanças.
| Infra | Docker, Nginx, GitHub Actions, Terraform | CI/CD padronizado e infraestrutura como código.

## 3. Arquitetura de Alto Nível
- **Aplicativo Flutter** comunica com:
  - **Gateway API** (HTTPS + mTLS opcional) para operações autenticadas.
  - **Firebase Firestore** para coleções sincronizadas e push (Cloud Messaging).
  - **Serviço de IA FinAI** para recomendações sob demanda.
- **API** interage com:
  - **PostgreSQL** (dados críticos: usuários, contas, orçamentos, investimentos, billing).
  - **Redis** (cache + filas de sincronização offline).
  - **Firestore Sync Worker** (espelha dados consolidados para coleções reativas).
  - **Serviço de processamento de arquivos** (CSV/Excel via Storage + Cloud Run).
- **Modo Offline**: dados locais + fila de comandos (CRDT simplificado) enviadas ao Sync Worker quando houver rede.

## 4. Domínios Funcionais
1. **Core Financeiro**: contas, categorias, multi-moedas, conciliação manual e futura integração bancária (Open Banking PALOP).
2. **Orçamento & Metas**: engine de regras, alertas e projeções com base nos últimos 6-12 meses.
3. **Relatórios Inteligentes**: dashboards, storytelling financeiro e "relatório de desperdício" (análise de outliers).
4. **Gestão Familiar**: grupos compartilhados, papéis (viewer, editor, aprovador) e workflows de aprovação.
5. **Investimentos & Patrimônio**: carteira manual, rentabilidade, metas de patrimônio líquido.
6. **FinAI**: recomendações (reduzir gastos, sugerir reserva, simulações) com explainability.

## 5. Aplicativo Flutter
- **Padrão de Estado**: Riverpod AsyncNotifiers + Freezed.
- **Camadas**:
  - `presentation`: páginas (Dashboard, Transações, Orçamentos, Metas, Investimentos, Família, Insights IA).
  - `application`: use-cases (ex: `AddExpenseUseCase`).
  - `infrastructure`: repositórios (REST, Firestore, Drift) + DTOs.
  - `domain`: entidades ricas e value objects.
- **Recursos chave**:
  - Theming dinâmico por status financeiro (verde/ambar/vermelho).
  - Gráficos interativos (Syncfusion Charts ou ECharts Flutter).
  - Animações Hero + Lottie para onboarding/insights.
  - Suporte a 3 idiomas (PT-PT, PT-BR, EN).
  - Acessibilidade (TalkBack/VoiceOver, alto contraste, fontes escaláveis).

## 6. Backend & Serviços
- **Gateway (Express)**
  - Autenticação JWT (Firebase) + RBAC (cargos compartilhados).
  - Rate limit adaptativo e detecção de dispositivos suspeitos (fingerprint + pontuação de risco).
  - Endpoints para transações, budgets, metas, investimentos, notificações, arquivos e IA.
- **FinAI Service (FastAPI/TensorFlow)**
  - Pipelines: clustering de gastos, previsão ARIMA/Prophet, recomendações heurísticas.
  - Modelo on-device: TensorFlow Lite para scoring de hábitos (funciona offline com dados locais).
- **Offline Sync Worker**
  - Recebe lotes de operações (CRDT/last-write-wins) e reconcilia com Postgres.
  - Gera eventos (Kafka/PubSub) para atualizações em tempo real.
- **Jobs & Filas**
  - BullMQ ou Cloud Tasks para lembretes, notificações push/e-mail, recalculo de metas.

## 7. Dados e Modelagem
- **PostgreSQL**
  - Tabelas: `users`, `households`, `accounts`, `transactions`, `budgets`, `goals`, `investments`, `portfolio_entries`, `suggestions`, `devices`.
  - Uso de `citext` para e-mail, `jsonb` para metadados, partições por `household_id`.
- **Firestore**
  - Coleções: `/households/{id}/dashboards`, `/users/{id}/insights`, `/households/{id}/alerts`.
  - Regras de segurança com claims customizadas (role, household, MFA).
- **Armazenamento**
  - Bucket privado para CSV/Excel, extratos e anexos (faturas). cada arquivo criptografado (CSEK/KMS).

## 8. Segurança e Compliance
- TLS 1.3 em todo o tráfego, HSTS, CSP estrita.
- Criptografia local AES-256 (chave derivada via biometric+PIN) para banco offline.
- 2FA (e-mail ou SMS) + biometria + PIN.
- Política LGPD/Lei 22/11: consentimento granular, direito ao esquecimento, logs imutáveis (AuditLog table + Object Storage WORM).
- Sistema anti-dispositivo suspeito: device fingerprint (hardware hash + geofence), bloqueio e aprovação manual.
- Backups automáticos (Postgres + Firestore export) e testes de restauração trimestrais.

## 9. Modo Offline & Sincronização
1. Transações salvas localmente (Drift) em `pending_operations`.
2. Worker background tenta sync a cada 15 min ou quando rede é restabelecida.
3. API aceita lotes com `client_op_id`, aplica idempotência e devolve `server_state_version`.
4. Em caso de conflito, resolve por "última atualização" e retorna diff amigável ao usuário.
5. Mensagens push indicam quando novos dados chegam de outros membros.

## 10. Roadmap de Integração
| Fase | Entregas |
| --- | --- |
| MVP (90 dias) | Onboarding, transações básicas, budgets simples, FinAI heurístico, offline local.
| Beta (180 dias) | Gestão familiar, metas avançadas, relatórios, sincronização completa e recomendações detalhadas.
| GA (270 dias) | Integração bancária (leitura extratos), investimentos, IA preditiva, parcerias comerciais.
| Escala (360+ dias) | Automação de pagamentos, open finance PALOP, marketplace de produtos financeiros.

## 11. Observabilidade & Analytics
- **KPIs**: retenção D30, adesão ao orçamento, taxa de sync offline, engajamento FinAI.
- **Ferramentas**: Google Analytics 4, Mixpanel (eventos de funil), Sentry (erros Flutter/API), Grafana (custos infra).

## 12. Práticas de Engenharia
- Monorepo gerenciado com Turborepo ou Nx (Flutter + Node + Infra).
- Testes: unitários (Dart/Mockito, Jest), integração (Flutter integration tests, Pact), E2E (Maestro, Playwright).
- Qualidade: lint (flutter analyze, eslint), pre-commit (lint + testes rápidos), security scans (Snyk, Trivy).
- Deploy: GitHub Actions → Docker → Cloud Run/Kubernetes + Firebase App Distribution/TestFlight/Play Store.
