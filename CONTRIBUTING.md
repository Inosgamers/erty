# Guia de Contribuição - Erty

Obrigado pelo interesse em contribuir com o Erty! Este documento fornece diretrizes para contribuições ao projeto.

## Como Contribuir

### 1. Reportar Bugs

Antes de reportar um bug:
- Verifique se o bug já não foi reportado nas [Issues](https://github.com/your-repo/issues)
- Teste com a última versão do código

Ao reportar, inclua:
- Descrição clara do problema
- Passos para reproduzir
- Comportamento esperado vs. atual
- Screenshots/logs se aplicável
- Versão do sistema operacional e do app

### 2. Sugerir Melhorias

Para sugestões de features:
- Abra uma issue com tag `enhancement`
- Descreva claramente a funcionalidade
- Explique por que seria útil
- Inclua mockups se possível

### 3. Pull Requests

#### Processo

1. **Fork** o repositório
2. **Clone** seu fork
3. Crie uma **branch** para sua feature:
   ```bash
   git checkout -b feature/minha-feature
   ```
4. **Faça commit** das mudanças:
   ```bash
   git commit -m "Add: descrição da feature"
   ```
5. **Push** para seu fork:
   ```bash
   git push origin feature/minha-feature
   ```
6. Abra um **Pull Request**

#### Padrões de Commit

Use prefixos claros:
- `Add:` - Nova funcionalidade
- `Fix:` - Correção de bug
- `Update:` - Atualização de funcionalidade existente
- `Refactor:` - Refatoração de código
- `Docs:` - Documentação
- `Test:` - Testes
- `Style:` - Formatação

Exemplo:
```
Add: sistema de notificações push
Fix: erro ao sincronizar transações offline
Update: melhorar performance do dashboard
```

## Padrões de Código

### Backend (Node.js)

- Use **ES6+** features
- Siga o **ESLint** configurado
- Adicione **JSDoc** para funções complexas
- Escreva **testes** para novas features
- Use **async/await** ao invés de callbacks

Exemplo:
```javascript
/**
 * Calcula o saldo total das contas
 * @param {string} userId - ID do usuário
 * @returns {Promise<number>} Saldo total
 */
async function calculateTotalBalance(userId) {
  const accounts = await Account.findAll({ where: { userId } });
  return accounts.reduce((sum, acc) => sum + acc.balance, 0);
}
```

### Mobile (Flutter)

- Siga o **Dart Style Guide**
- Use **const** quando possível
- Adicione **comentários** para widgets complexos
- Separe UI de lógica (use **Providers**)
- Nomeie widgets com sufixo `Widget` ou `Screen`

Exemplo:
```dart
class BalanceCard extends StatelessWidget {
  const BalanceCard({super.key});

  @override
  Widget build(BuildContext context) {
    return Consumer<AccountProvider>(
      builder: (context, provider, _) {
        return Card(
          child: Text('Saldo: ${provider.totalBalance}'),
        );
      },
    );
  }
}
```

## Estrutura de Arquivos

### Backend
```
erty-backend/
├── src/
│   ├── config/         # Configurações
│   ├── controllers/    # Controllers
│   ├── models/         # Models
│   ├── routes/         # Rotas
│   ├── services/       # Lógica de negócio
│   ├── middleware/     # Middlewares
│   └── utils/          # Utilitários
```

### Mobile
```
erty-mobile/
├── lib/
│   ├── core/           # Core (config, routes, theme)
│   ├── data/           # Data layer
│   ├── domain/         # Domain layer
│   └── presentation/   # UI layer
│       ├── providers/  # State management
│       ├── screens/    # Telas
│       └── widgets/    # Widgets reutilizáveis
```

## Testes

### Backend

```bash
cd erty-backend
npm test
```

Escreva testes para:
- Controllers
- Services
- Middlewares críticos

### Mobile

```bash
cd erty-mobile
flutter test
```

Escreva testes para:
- Providers
- Utils
- Widgets complexos

## Documentação

- Atualize o README se necessário
- Documente APIs no `docs/API.md`
- Adicione comentários para código complexo
- Atualize CHANGELOG para mudanças significativas

## Checklist para Pull Request

Antes de submeter:

- [ ] Código segue os padrões do projeto
- [ ] Testes adicionados/atualizados
- [ ] Documentação atualizada
- [ ] Commit messages são claros
- [ ] Branch está atualizada com main
- [ ] Sem conflitos
- [ ] CI/CD passa sem erros

## Código de Conduta

- Seja respeitoso
- Aceite críticas construtivas
- Foque no que é melhor para a comunidade
- Demonstre empatia

## Dúvidas?

- Abra uma issue com tag `question`
- Entre em contato: contribuicoes@erty.app

Obrigado por contribuir! 🎉
