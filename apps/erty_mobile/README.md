# Erty Mobile

Aplicativo Flutter para o ecossistema Finanças em Ordem. O foco é entregar IA financeira, gestão familiar, modo offline e sincronização automática.

## Principais camadas
- `presentation`: páginas e widgets com Material You 3.0.
- `application`: controladores Riverpod e casos de uso.
- `domain`: entidades e lógica de negócios.
- `infrastructure`: repositórios REST/Firestore/Drift.
- `core`: serviços compartilhados (tema dinâmico, offline, FinAI).

## Requisitos
- Flutter 3.22+
- Dart 3.3+
- Android Studio/VSCode + extensions Flutter

## Scripts úteis
```bash
flutter pub get
flutter analyze
flutter test
flutter run --flavor staging
```

## Modo offline
- Drift + sqlite3 para cache transacional local.
- Fila de operações idempotentes enviada ao backend quando a conectividade retorna.

## IA Financeira
- Cliente FinAI consome recomendações via gRPC/REST.
- Modelos TensorFlow Lite podem executar localmente para insights rápidos e privados.
