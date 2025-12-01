# Erty – Finanças em Ordem

Aplicação multiplataforma para gestão financeira pessoal e familiar com IA, modo offline resiliente e segurança de nível bancário. Este repositório reúne documentação estratégica, esqueleto do app Flutter e protótipo inicial da API Node.js.

## Estrutura do Repositório
```
.
├─ docs/                    # Arquitetura e plano de implementação
├─ mobile/erty_app/         # Projeto Flutter (Material You 3.0, Riverpod, GoRouter)
└─ backend/erty_api/        # API Express/TypeScript pronta para expansão
```

## Destaques de Produto
- FinAI com recomendações explicativas, previsão de saldo e relatório de desperdício.
- Gestão familiar com perfis e aprovações.
- Offline-first com sincronização automática e fila de mutações.
- Segurança: AES-256 local, TLS/HTTPS, biometria, 2FA e conformidade LGPD/Lei angolana.
- Relatórios inteligentes (orçamento vs realizado, metas, investimentos, comparativos mensais).

## Como começar
### App Flutter
```bash
cd mobile/erty_app
flutter pub get
flutter run
```

### API Node.js
```bash
cd backend/erty_api
npm install
npm run dev
```

## Documentação essencial
- `docs/architecture.md`: visão sistêmica, componentes, segurança, roadmap.
- `docs/implementation-plan.md`: fases, backlog temático, qualidade, métricas.

## Próximos passos sugeridos
1. Configurar Firebase (Auth/Messaging) e Isar no app.
2. Conectar API ao PostgreSQL/Firestore com Prisma e camadas de domínio.
3. Implementar pipelines FinAI (Treino em Vertex AI + modelos TensorFlow Lite no app).
4. Automatizar CI/CD (Flutter + Node) e observabilidade (Sentry/Otel).

Com estes artefatos, a equipe pode evoluir rapidamente para uma versão funcional do Erty, preparada para integrações bancárias futuras e escalabilidade regional nos PALOP.
