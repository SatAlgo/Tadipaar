import 'package:flutter/material.dart';
import 'create_externed_screen.dart';

class PoliceDashboard extends StatelessWidget {
  final String token;

  PoliceDashboard({required this.token});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text("Police Dashboard")),
      body: Center(
        child: ElevatedButton(
          child: Text("Create Externed Person"),
          onPressed: () {
            Navigator.push(
              context,
              MaterialPageRoute(
                builder: (_) => CreateExternedScreen(token: token),
              ),
            );
          },
        ),
      ),
    );
  }
}