# Erty API

API segura para o aplicativo móvel Erty, construída em Express + TypeScript.

## Funcionalidades previstas
- Autenticação com Firebase JWT + 2FA opcional.
- CRUD de transações, orçamentos, metas e investimentos.
- Serviço FinAI para recomendações baseadas em hábitos.
- Fila BullMQ para sincronização offline e notificações.
- Conectores futuros para bancos angolanos e PALOP.

## Scripts
```bash
pnpm install
pnpm dev
pnpm test
pnpm lint
```
(Remova `pnpm` por `npm`/`yarn` conforme preferência.)

## Estrutura
```
src/
  config/        -> env, logger, providers
  modules/       -> contextos (transactions, budgets, finai, households)
  middlewares/   -> auth, erro, device fingerprint
  jobs/          -> filas offline & notificações
```

## Variáveis importantes
- `PORT`, `DATABASE_URL`, `REDIS_URL`
- `FIREBASE_PROJECT_ID`, `FIREBASE_CLIENT_EMAIL`, `FIREBASE_PRIVATE_KEY`
- `JWT_AUDIENCE`, `JWT_ISSUER`
