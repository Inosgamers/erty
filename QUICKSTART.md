# 🚀 Guia Rápido - Erty

## Início Rápido (5 minutos)

### Opção 1: Docker (Mais Fácil) 🐳

```bash
# 1. Clone o repositório
git clone <repository-url>
cd erty

# 2. Configure o ambiente
cp erty-backend/.env.example erty-backend/.env

# 3. Inicie tudo com Docker
docker-compose up -d

# 4. Verifique se está rodando
curl http://localhost:3000/health
```

✅ **Pronto!** API rodando em http://localhost:3000

### Opção 2: Manual

#### Backend

```bash
cd erty-backend

# Instalar dependências
npm install

# Configurar ambiente
cp .env.example .env

# Iniciar PostgreSQL e Redis localmente ou usar Docker:
docker run -d -p 5432:5432 -e POSTGRES_PASSWORD=postgres postgres:14-alpine
docker run -d -p 6379:6379 redis:7-alpine

# Iniciar servidor
npm run dev
```

#### Mobile

```bash
cd erty-mobile

# Instalar dependências
flutter pub get

# Rodar no emulador/dispositivo
flutter run
```

## Teste Rápido da API

```bash
# Registrar usuário
curl -X POST http://localhost:3000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "João Silva",
    "email": "joao@example.com",
    "password": "senha123"
  }'

# Login
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "joao@example.com",
    "password": "senha123"
  }'
```

## Estrutura do Projeto

```
erty/
├── erty-backend/        # 🔧 API Node.js + Express
│   ├── src/
│   │   ├── controllers/ # Controladores
│   │   ├── models/      # Modelos do banco
│   │   ├── routes/      # Rotas da API
│   │   ├── services/    # Lógica de negócio
│   │   └── middleware/  # Middlewares
│   └── package.json
│
├── erty-mobile/         # 📱 App Flutter
│   ├── lib/
│   │   ├── core/        # Configurações
│   │   ├── data/        # Repositórios
│   │   ├── domain/      # Entidades
│   │   └── presentation/# UI (Telas, Widgets)
│   └── pubspec.yaml
│
├── docs/                # 📚 Documentação
│   ├── API.md          # Referência da API
│   └── DEPLOYMENT.md   # Guia de deploy
│
├── docker-compose.yml   # 🐳 Configuração Docker
└── README.md           # 📖 Leia-me principal
```

## Principais Funcionalidades

### ✅ Implementado

- ✅ **Autenticação JWT** - Login/Registro seguro
- ✅ **Gestão de Contas** - Múltiplas contas bancárias
- ✅ **Transações** - Despesas, receitas e transferências
- ✅ **Orçamentos** - Criar e monitorar orçamentos
- ✅ **Metas Financeiras** - Definir e acompanhar metas
- ✅ **Dashboard Interativo** - Visão geral das finanças
- ✅ **IA Financeira (FinAI)** - Recomendações inteligentes
- ✅ **Sincronização Offline** - Funciona sem internet
- ✅ **Gestão Familiar** - Contas compartilhadas
- ✅ **Relatórios** - Análises e estatísticas
- ✅ **Multi-moeda** - Suporte AOA, USD, EUR, BRL
- ✅ **Material Design 3.0** - Interface moderna
- ✅ **Docker & CI/CD** - Deploy automatizado

## Tecnologias Utilizadas

### Backend
- **Node.js 18+** - Runtime JavaScript
- **Express** - Framework web
- **PostgreSQL** - Banco de dados relacional
- **Redis** - Cache e sessões
- **Sequelize** - ORM
- **JWT** - Autenticação
- **Winston** - Logging
- **Joi** - Validação

### Mobile
- **Flutter 3.0+** - Framework UI
- **Dart** - Linguagem
- **Provider** - State management
- **Dio** - HTTP client
- **Hive** - Database local
- **Go Router** - Navegação
- **FL Chart** - Gráficos

### DevOps
- **Docker** - Containerização
- **Docker Compose** - Orquestração
- **Nginx** - Reverse proxy
- **GitHub Actions** - CI/CD

## Endpoints Principais

### Autenticação
- `POST /api/v1/auth/register` - Registrar
- `POST /api/v1/auth/login` - Login
- `GET /api/v1/auth/me` - Perfil

### Transações
- `GET /api/v1/transactions` - Listar
- `POST /api/v1/transactions` - Criar
- `GET /api/v1/transactions/statistics` - Estatísticas

### Contas
- `GET /api/v1/accounts` - Listar contas
- `POST /api/v1/accounts` - Criar conta

### Orçamentos
- `GET /api/v1/budgets` - Listar orçamentos
- `POST /api/v1/budgets` - Criar orçamento

### IA
- `GET /api/v1/ai/recommendations` - Recomendações
- `GET /api/v1/ai/insights` - Insights (Premium)

Ver documentação completa: [`docs/API.md`](docs/API.md)

## Configuração do Mobile

Editar `lib/core/config/app_config.dart`:

```dart
class AppConfig {
  static const String apiBaseUrl = 'http://localhost:3000/api/v1';
  // Para dispositivo físico Android, use:
  // static const String apiBaseUrl = 'http://10.0.2.2:3000/api/v1';
  // Para iOS, use o IP da máquina
}
```

## Próximos Passos

1. 📖 **Explorar a API** - Ver [`docs/API.md`](docs/API.md)
2. 🚀 **Deploy** - Ver [`docs/DEPLOYMENT.md`](docs/DEPLOYMENT.md)
3. 🤝 **Contribuir** - Ver [`CONTRIBUTING.md`](CONTRIBUTING.md)
4. 🐛 **Reportar Bugs** - Abrir issue no GitHub

## Scripts Úteis

### Backend
```bash
npm run dev          # Desenvolvimento
npm start            # Produção
npm test             # Testes
npm run lint         # Linter
npm run migrate      # Migrations
```

### Mobile
```bash
flutter pub get      # Instalar dependências
flutter run          # Rodar app
flutter test         # Testes
flutter build apk    # Build APK
flutter analyze      # Análise de código
```

### Docker
```bash
docker-compose up -d              # Iniciar
docker-compose down               # Parar
docker-compose logs -f backend    # Ver logs
docker-compose restart backend    # Reiniciar serviço
```

## Variáveis de Ambiente Importantes

```env
# Backend (.env)
NODE_ENV=development
PORT=3000
DB_HOST=localhost
DB_NAME=erty_db
DB_USER=postgres
DB_PASSWORD=your_password
REDIS_HOST=localhost
JWT_SECRET=your_secret_key
```

## Troubleshooting

### Erro de conexão com banco
```bash
# Verificar se PostgreSQL está rodando
docker ps | grep postgres

# Testar conexão
docker exec -it erty_postgres psql -U postgres -c "SELECT 1"
```

### App móvel não conecta
- Verificar `apiBaseUrl` está correto
- Usar `10.0.2.2` para emulador Android
- Usar IP da máquina para dispositivo físico

### Porta já em uso
```bash
# Matar processo na porta 3000
lsof -ti:3000 | xargs kill -9
```

## Recursos Adicionais

- 📚 **Documentação da API**: [`docs/API.md`](docs/API.md)
- 🚀 **Guia de Deploy**: [`docs/DEPLOYMENT.md`](docs/DEPLOYMENT.md)
- 🤝 **Como Contribuir**: [`CONTRIBUTING.md`](CONTRIBUTING.md)
- 📄 **Licença**: [`LICENSE`](LICENSE)

## Suporte

- 📧 Email: suporte@erty.app
- 🐛 Issues: GitHub Issues
- 💬 Discord: [Comunidade Erty](https://discord.gg/erty)

---

**Desenvolvido com ❤️ para democratizar o acesso à gestão financeira inteligente**
