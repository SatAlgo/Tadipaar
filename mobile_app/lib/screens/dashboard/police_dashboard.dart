import 'package:flutter/material.dart';

class PoliceDashboard extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text("Police Dashboard")),
      body: Center(
        child: Text("Welcome Officer 👮"),
      ),
    );
  }
}