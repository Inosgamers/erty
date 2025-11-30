import 'package:flutter/material.dart';

class BudgetListScreen extends StatelessWidget {
  const BudgetListScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Orçamentos'),
      ),
      body: const Center(
        child: Text('Lista de Orçamentos'),
      ),
    );
  }
}
