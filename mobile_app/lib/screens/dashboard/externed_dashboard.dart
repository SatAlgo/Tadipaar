import 'package:flutter/material.dart';

class ExternedDashboard extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text("Externed Dashboard")),
      body: Center(
        child: Text("Tracking Active 📍"),
      ),
    );
  }
}