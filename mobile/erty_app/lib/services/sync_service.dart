import 'dart:async';

import 'package:flutter_riverpod/flutter_riverpod.dart';

/// Modelo reduzido para representar uma mutação pendente
class SyncMutation {
  SyncMutation({required this.id, required this.payload, required this.createdAt});
  final String id;
  final Map<String, dynamic> payload;
  final DateTime createdAt;
}

final syncQueueProvider = StateNotifierProvider<SyncQueueNotifier, List<SyncMutation>>(
  (ref) => SyncQueueNotifier(),
);

class SyncQueueNotifier extends StateNotifier<List<SyncMutation>> {
  SyncQueueNotifier() : super(const []);

  void enqueue(SyncMutation mutation) {
    state = [...state, mutation];
  }

  void markSynced(String id) {
    state = state.where((mutation) => mutation.id != id).toList();
  }
}

final syncServiceProvider = Provider<SyncService>((ref) {
  return SyncService(notifier: ref.read(syncQueueProvider.notifier));
});

class SyncService {
  SyncService({required this.notifier});
  final SyncQueueNotifier notifier;
  Timer? _timer;

  void start() {
    _timer ??= Timer.periodic(const Duration(minutes: 5), (_) => flush());
  }

  Future<void> flush() async {
    // TODO: integrar com Isar + API para envio real.
    for (final mutation in notifier.state) {
      await Future<void>.delayed(const Duration(milliseconds: 200));
      notifier.markSynced(mutation.id);
    }
  }

  void dispose() {
    _timer?.cancel();
  }
}
