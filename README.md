# Erty - Finanças em Ordem 💰

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![Flutter](https://img.shields.io/badge/Flutter-3.0+-02569B.svg?logo=flutter)
![Node.js](https://img.shields.io/badge/Node.js-18+-339933.svg?logo=node.js)
![License](https://img.shields.io/badge/license-MIT-green.svg)

**Erty** é uma aplicação móvel multiplataforma inteligente para gestão financeira pessoal e familiar, com IA integrada, design moderno e modo offline com sincronização automática.

## 🎯 Visão Geral

Finanças em Ordem é um assistente financeiro completo que ajuda usuários a:
- 💵 Organizar despesas e receitas
- 📊 Criar orçamentos inteligentes
- 🎯 Definir e acompanhar metas financeiras
- 🏦 Monitorar investimentos e patrimônio
- 👥 Gerenciar finanças familiares compartilhadas
- 🤖 Receber insights personalizados com IA

## ✨ Diferenciais

### 🧠 IA Financeira (FinAI)
- Análise automática de padrões de gastos
- Recomendações personalizadas baseadas em hábitos
- Detecção de gastos anormais e desperdícios
- Sugestões de economia e otimização

### 📱 Modo Offline Inteligente
- Funciona sem internet
- Sincronização automática em background
- Conflitos resolvidos automaticamente
- Dados sempre disponíveis

### 👨‍👩‍👧‍👦 Gestão Familiar
- Contas compartilhadas
- Perfis de acesso diferenciados
- Visualização consolidada e individual
- Aprovação de despesas

### 🔐 Segurança Avançada
- Criptografia AES-256
- Autenticação biométrica
- 2FA (SMS/E-mail)
- Backup automático seguro

## 🏗️ Arquitetura

```
erty/
├── erty-mobile/          # Flutter App (Android/iOS)
│   ├── lib/
│   │   ├── core/         # Core utilities, constants
│   │   ├── data/         # Data layer (models, repositories)
│   │   ├── domain/       # Business logic (entities, use cases)
│   │   ├── presentation/ # UI layer (screens, widgets)
│   │   └── services/     # External services (API, storage)
│   └── test/             # Unit and widget tests
│
├── erty-backend/         # Node.js API
│   ├── src/
│   │   ├── config/       # Configuration files
│   │   ├── controllers/  # Route controllers
│   │   ├── models/       # Database models
│   │   ├── services/     # Business logic
│   │   ├── middleware/   # Express middleware
│   │   ├── routes/       # API routes
│   │   └── utils/        # Utilities
│   └── tests/            # API tests
│
└── docs/                 # Documentation
```

## 🚀 Funcionalidades Principais

### 💰 Gestão Financeira
- [x] Registro de despesas e receitas
- [x] Categorização automática
- [x] Múltiplas moedas (Kz, USD, EUR)
- [x] Filtros avançados
- [x] Importação/Exportação (CSV, Excel)

### 📊 Orçamentos e Planejamento
- [x] Orçamentos mensais por categoria
- [x] Alertas de limite
- [x] Projeções baseadas em histórico
- [x] Comparativo mensal

### 📈 Relatórios e Análises
- [x] Dashboard interativo
- [x] Gráficos dinâmicos
- [x] Relatório de desperdício
- [x] Orçamento vs Realizado
- [x] Análise por categoria/pessoa

### 🎯 Metas Financeiras
- [x] Definição de metas
- [x] Acompanhamento de progresso
- [x] Recomendações de ajuste
- [x] Timeline visual

### 🏦 Investimentos
- [x] Registro de investimentos
- [x] Acompanhamento de rentabilidade
- [x] Cálculo de patrimônio líquido
- [x] Projeções financeiras

## 🛠️ Stack Tecnológica

| Camada | Tecnologia |
|--------|-----------|
| **Mobile** | Flutter 3.0+ (Dart) |
| **Backend** | Node.js 18+ (Express) |
| **Banco de Dados** | PostgreSQL + Firebase Firestore |
| **Cache** | Redis |
| **Autenticação** | JWT + Firebase Auth |
| **Storage** | AWS S3 / Google Cloud Storage |
| **IA/ML** | TensorFlow Lite |
| **DevOps** | Docker, Nginx, GitHub Actions |
| **Monitoramento** | Sentry, Google Analytics |

## 📦 Instalação

### Pré-requisitos
- Node.js 18+
- Flutter 3.0+
- PostgreSQL 14+
- Docker (opcional)

### Backend

```bash
cd erty-backend
npm install
cp .env.example .env
# Configure as variáveis de ambiente
npm run migrate
npm run dev
```

### Mobile

```bash
cd erty-mobile
flutter pub get
flutter run
```

### Docker (Recomendado)

```bash
docker-compose up -d
```

## 🧪 Testes

```bash
# Backend
cd erty-backend
npm test

# Mobile
cd erty-mobile
flutter test
```

## 📱 Capturas de Tela

_(Em desenvolvimento)_

## 🌍 Roadmap

### Fase 1 - MVP (Atual)
- ✅ Gestão de despesas e receitas
- ✅ Orçamentos básicos
- ✅ Relatórios simples
- ✅ Modo offline
- ✅ Autenticação segura

### Fase 2 - IA e Análises
- 🔄 IA Financeira (FinAI)
- 🔄 Relatórios avançados
- 🔄 Previsões financeiras
- 🔄 Detecção de anomalias

### Fase 3 - Integração Bancária
- 📋 API Open Banking Angola
- 📋 Importação automática de extratos
- 📋 Conciliação bancária
- 📋 Pagamentos integrados

### Fase 4 - Expansão
- 📋 Versão Web
- 📋 Marketplace de serviços
- 📋 Educação financeira
- 📋 Expansão PALOP

## 🤝 Contribuindo

Contribuições são bem-vindas! Por favor, leia [CONTRIBUTING.md](CONTRIBUTING.md) para detalhes.

## 📄 Licença

Este projeto está licenciado sob a Licença MIT - veja [LICENSE](LICENSE) para detalhes.

## 👥 Equipe

Desenvolvido com ❤️ para tornar as finanças mais acessíveis e inteligentes.

## 📞 Suporte

- 📧 Email: suporte@erty.app
- 🌐 Website: https://erty.app
- 💬 Discord: [Comunidade Erty](https://discord.gg/erty)

---

**Erty - Transformando sua relação com o dinheiro** 💰✨
