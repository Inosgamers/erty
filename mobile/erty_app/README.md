# Erty App (Flutter)

Aplicativo móvel multiplataforma para gestão financeira inteligente com IA, modo offline e colaboração familiar.

## Requisitos
- Flutter 3.24+
- Dart 3.3+
- Android Studio ou Xcode para build nativo

## Configuração Rápida
```bash
flutter pub get
flutter run
```

## Estrutura inicial
```
lib/
  core/
    routes/       # GoRouter e navegação declarativa
    theme/        # Temas Material You customizados
  features/
    dashboard/    # Dashboard responsivo com cartões e insights
    insights/     # Modelos e regras FinAI locais
  services/
    sync_service.dart  # Protótipo da fila offline -> nuvem
```

## Próximos Passos
- Integrar Firebase (Auth, Messaging), Isar para cache offline e Riverpod para estado global completo.
- Implementar módulos de transações, orçamentos, metas e família.
- Conectar ao backend `erty_api` usando Dio + interceptadores seguros.
- Adicionar testes widget/integration e cobertura para regras FinAI locais.
