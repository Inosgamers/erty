import 'package:flutter/material.dart';

class AccountListScreen extends StatelessWidget {
  const AccountListScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Contas'),
      ),
      body: const Center(
        child: Text('Lista de Contas'),
      ),
    );
  }
}
