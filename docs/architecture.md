# Arquitetura de Referência – Erty (Finanças em Ordem)

## 1. Visão Geral
Erty é um ecossistema composto por um aplicativo Flutter (Android/iOS), uma API cloud-native em Node.js/Express com TypeScript, serviços de IA financeira (FinAI) e uma infraestrutura orientada a eventos preparada para integrações futuras com bancos dos PALOP. O foco é permitir uso offline com sincronização inteligente, oferecendo análises explicativas e segurança de nível bancário.

```
+-------------+      TLS/HTTPS      +-----------------+      Pub/Sub & Jobs      +-----------------+
|  Flutter    | <-----------------> |  API Gateway /  | <---------------------> |  Serviços de IA |
|  Mobile     |                     |  BFF (Express)  |                         |  & Analytics    |
+-------------+                     +-----------------+                         +-----------------+
        |                                   |                                            |
        |          Synchronization          |                    Event streams           |
        v                                   v                                            v
  SQLite/Isar offline cache      PostgreSQL + Firestore     Vertex AI / TensorFlow Lite   Cloud Functions
```

## 2. Objetivos do Produto
- Organizar finanças pessoais e familiares com suporte multiusuário.
- Entregar recomendações acionáveis usando IA local (TensorFlow Lite) e nuvem.
- Operar em modo offline com sincronização resiliente e transparente.
- Garantir segurança (AES-256 em repouso, TLS 1.2+, 2FA, biometria) e conformidade com LGPD/Lei angolana.

## 3. Camadas e Responsabilidades
| Camada | Responsabilidades-chave |
| ------ | ----------------------- |
| App Flutter | UI Material You 3.0, estado (Riverpod), cache offline via Isar/SQLite, FinAI local, notificações push, biometria. |
| API/BFF | Autenticação (Firebase Auth + JWT/2FA), orquestração de workflows, validação, agregação de dados e autorização por perfil. |
| Core Services | Módulos de orçamentos, transações, investimentos, metas, relatórios, família, import/export. |
| Data & Storage | PostgreSQL (dados relacionais e relatórios), Firestore (config em tempo real), S3/GCS (anexos), Redis (cache/sessões). |
| IA & Analytics | TensorFlow Lite (modelos embarcados), pipelines de treinamento em Vertex AI, Feature Store, recomendações Near real-time. |
| Observabilidade & Segurança | Sentry, OpenTelemetry, Grafana, Cloud Logging, escaneamento OWASP, secrets via Secret Manager, backups automáticos. |

## 4. Componentes Principais
### 4.1 Aplicativo Flutter
- **Arquitetura:** Clean Architecture (camadas presentation/domain/data), roteamento com `go_router`, estado com Riverpod/StateNotifier.
- **Módulos:** Dashboard dinâmico, transações, orçamento, metas, investimentos, família, perfil/segurança, FinAI Hub.
- **Offline:** Isar DB para entidades principais; fila de eventos `SyncQueue` persistida; background fetch usando `workmanager`.
- **UX:** Material You adaptativo, dark mode, animações com `ImplicitlyAnimatedReorderableList`, componentes acessíveis (semantics/voice over).

### 4.2 Backend/API (Node.js + TypeScript)
- **Estrutura:** Monorepo leve com módulos hexagonais, validação com Zod, ORM Prisma (PostgreSQL), filas BullMQ (Redis), WebSockets para tempo real.
- **Auth:** Firebase Auth para identidade, Exchange para JWT curto (15 min) + refresh token. Suporte a 2FA (e-mail/SMS) e device fingerprint.
- **Serviços:**
  - **Ledger Service:** ingestão de transações, categorização, conciliação bancária futura.
  - **Budgeting Service:** limites, alertas, projeções.
  - **Goals Service:** metas com linha do tempo e recomendações.
  - **Investment Service:** rentabilidade, patrimônio, projeções Monte Carlo.
  - **Family Hub:** papéis, permissões, aprovação de despesas.
  - **Reports Service:** geração de dashboards e relatórios exportáveis (CSV/XLSX via `exceljs`).
  - **Notification Service:** push (FCM/APNs), e-mail (SendGrid), SMS (Twilio), lembretes.
  - **Sync Service:** reconciliação de fila offline, resolução de conflitos `last-write-wins + merge rules`.

### 4.3 FinAI
- **Pipeline:**
  1. Colete features anonimizadas -> BigQuery/Feature Store.
  2. Treine modelos (clusterização K-Means hábitos, LSTM previsão de saldo, Isolation Forest para desperdício).
  3. Exporte versão quantizada (TensorFlow Lite) para o app e mantenha modelo mestre na nuvem.
- **Recomendações:**
  - Redução de assinaturas pouco usadas.
  - Sugestão de poupança automática baseado em fluxo de caixa.
  - Alertas de desperdício vs média histórica.
  - Projeção de metas (probabilidade de sucesso, ajustes sugeridos).
- **Explainability:** utilize SHAP values simplificados para explicar motivos de alertas (exibir top 3 fatores).

### 4.4 Offline & Sincronização
- Estratégia `optimistic UI + operational transforms`.
- Cada operação gera `MutationRecord` com UUID, versão, dependências.
- Sync Service compara `updatedAt` e versões; conflitos resolvidos por política:
  - Transações: merge por soma ou substituição se mesmo ID.
  - Orçamentos/metas: prioriza alteração mais recente; envia notificação se houver divergência familiar.
- Compressão e loteamento para minimizar payloads (Protocol Buffers opcionais).

### 4.5 Segurança End-to-End
- Armazenamento local criptografado (Isar + AES-GCM, chaves no KeyStore/Keychain).
- TLS obrigatório; pinning opcional.
- Política Zero Trust no backend (mTLS entre serviços, Cloud Armor).
- Auditoria: trilhas de acesso, consentimento granular para compartilhamento familiar.

### 4.6 Infraestrutura & DevOps
- Infra em GCP (alternativa AWS):
  - Cloud Run para API/BFF.
  - Cloud SQL (PostgreSQL) + Firestore.
  - Cloud Storage para anexos.
  - Vertex AI para treinos FinAI.
  - Cloud Tasks / Workflows para orquestração.
- CI/CD GitHub Actions:
  - lint/test/build Flutter.
  - testes backend (Jest), lint (ESLint), verificação Prisma.
  - Deploy automatizado com aprovação manual para produção.
- Observabilidade: OpenTelemetry -> Cloud Trace/Grafana, alertas SLO (latência P95 < 300ms, erro <1%).

## 5. Fluxos Críticos
1. **Autenticação Segura:** onboarding -> verificação e-mail/SMS -> registro biométrico opcional -> device fingerprint.
2. **Modo Offline:** usuário cria transação -> salva em cache -> UI atualiza -> fila `SyncQueue` envia quando online -> backend responde com status -> UI reconcilia.
3. **Recomendações FinAI:** job diário agrega gastos -> modelo identifica padrões -> gera insight -> envia push + cartão contextual.
4. **Gestão Familiar:** admin cria grupo -> define papéis -> convites -> fluxo de aprovação (push/e-mail) para grandes despesas.
5. **Relatório de Desperdício:** Isolation Forest detecta outliers -> classifica categorias -> UI mostra explicação e ações sugeridas.

## 6. Modelo de Dados (principais entidades)
| Entidade | Campos-chave | Observações |
| -------- | ------------ | ----------- |
| `User` | id, nome, email, país, moedaPreferida, onboardingStatus, deviceFingerprint[] | Auth Firebase, preferências. |
| `Household` | id, ownerId, nome, membros[], regrasPermissao | Multiusuário/famílias. |
| `Account` | id, userId, tipo (pessoal, família, negócio), moeda, saldoAtual | Suporte múltiplas moedas. |
| `Transaction` | id, accountId, householdId, tipo, categoria, valor, moeda, data, pessoa, metodoPagto, tags, origem | Suporta importações e status de reconciliação. |
| `Budget` | id, householdId, categoria, periodo, limite, gastoAtual, alertThreshold | Inclui alertas automáticos. |
| `Goal` | id, householdId, descricao, valorAlvo, valorAtual, deadline, status | Recomendação de ajustes. |
| `Investment` | id, householdId, tipo, aporteTotal, rentabilidade, risco, horizonte | Permite projeções. |
| `Insight` | id, householdId, tipo, severidade, mensagem, fatores[], status | Gera histórico auditável. |
| `SyncMutation` | id, userId, entidade, payload, version, status, retries | Controle do modo offline. |

## 7. Segurança e Conformidade
- Política de consentimento explícito para compartilhamento familiar.
- Dados sensíveis pseudonimizados antes de treinamento.
- LGPD/LDP: direito ao esquecimento, portabilidade (export CSV/Excel), registro de consentimento.
- Anti-dispositivo suspeito: detecção de IP/location anômala, bloqueio automático e challenge 2FA.

## 8. Escalabilidade e Resiliência
- API stateless, autoscaling (Cloud Run min 2 instâncias, max 50).
- Redis clusterizado para filas e rate limiting.
- Backups diários + point-in-time recovery (PITR) para PostgreSQL.
- Feature flags (LaunchDarkly) para liberar integrações bancárias gradualmente.
- Chaos testing leve (falhas de rede simuladas para sync offline).

## 9. Roadmap Técnico (alto nível)
1. **MVP (0-3 meses):** cadastro, transações básicas, orçamentos, metas simples, FinAI insights básicos, modo offline, notificações.
2. **Versão Premium (3-6 meses):** investimentos, relatórios avançados, multiusuário completo, assinatura in-app.
3. **Integrações Bancárias (6-9 meses):** conectores OFX/PSD2, conciliação automática.
4. **Expansão PALOP (9-12 meses):** localizações adicionais, parcerias bancárias, IA localizada.

Esta arquitetura serve como base para implementar o produto conforme os requisitos de segurança, escalabilidade e experiência definidos na visão do Erty.
