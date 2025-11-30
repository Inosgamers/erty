# Erty API (Node.js + Express)

## Visão Geral
API BFF escrita em TypeScript/Express. Fornece recursos de finanças pessoais, relatórios inteligentes e endpoints para o app Flutter. Projetada para rodar em Cloud Run ou containers Docker.

## Requisitos
- Node.js >= 20
- pnpm ou npm (exemplos com npm)

## Scripts
```bash
npm install
npm run dev       # modo desenvolvimento com hot reload (tsx)
npm run build     # transpila para dist/
npm start         # executa build transpiled
```

## Estrutura inicial
```
src/
  config/env.ts           # validação de variáveis ambiente
  app.ts                  # middlewares Express
  routes/                 # registradores de rotas
  modules/health          # ping/healthcheck
  modules/finance         # endpoints de transações e orçamentos
  modules/insights        # mock de recomendações FinAI
```

## Próximos Passos
- Integrar Prisma + PostgreSQL e Firestore.
- Implementar autenticação Firebase/JWT e autorização baseada em papéis familiares.
- Conectar com serviços de filas (BullMQ/Redis) para sync offline.
- Adicionar testes (Jest/Supertest) e linters (ESLint) na pipeline.
