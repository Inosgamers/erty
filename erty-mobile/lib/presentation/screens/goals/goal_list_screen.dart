import 'package:flutter/material.dart';

class GoalListScreen extends StatelessWidget {
  const GoalListScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Metas'),
      ),
      body: const Center(
        child: Text('Lista de Metas'),
      ),
    );
  }
}
