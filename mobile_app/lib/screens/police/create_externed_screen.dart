import 'package:flutter/material.dart';
import '../../services/police_service.dart';

class CreateExternedScreen extends StatefulWidget {
  final String token;
  CreateExternedScreen({required this.token});

  @override
  _CreateExternedScreenState createState() =>
      _CreateExternedScreenState();
}

class _CreateExternedScreenState extends State<CreateExternedScreen> {

  final fullNameController = TextEditingController();
  final mobileController = TextEditingController();
  final passwordController = TextEditingController();
  final caseIdController = TextEditingController();
  final cityController = TextEditingController();

  final PoliceService _policeService = PoliceService();

  void createExterned() async {
    bool success = await _policeService.createExterned(
      widget.token,
      fullNameController.text,
      mobileController.text,
      passwordController.text,
      caseIdController.text,
      cityController.text,
    );

    if (success) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text("Externed created successfully")),
      );
    } else {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text("Failed to create")),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text("Create Externed")),
      body: SingleChildScrollView(
        padding: EdgeInsets.all(20),
        child: Column(
          children: [
            TextField(controller: fullNameController, decoration: InputDecoration(labelText: "Full Name")),
            TextField(controller: mobileController, decoration: InputDecoration(labelText: "Mobile")),
            TextField(controller: passwordController, decoration: InputDecoration(labelText: "Password")),
            TextField(controller: caseIdController, decoration: InputDecoration(labelText: "Case ID")),
            TextField(controller: cityController, decoration: InputDecoration(labelText: "Assigned City")),
            SizedBox(height: 20),
            ElevatedButton(
              onPressed: createExterned,
              child: Text("Create"),
            )
          ],
        ),
      ),
    );
  }
}