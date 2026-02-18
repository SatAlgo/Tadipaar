import 'package:flutter/material.dart';
import '../../services/auth_service.dart';
import '../police/police_dashboard.dart';
import '../externed/externed_dashboard.dart';

class LoginScreen extends StatefulWidget {
  @override
  _LoginScreenState createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {

  final mobileController = TextEditingController();
  final passwordController = TextEditingController();
  final AuthService _authService = AuthService();

  void loginUser() async {
    final user = await _authService.login(
      mobileController.text.trim(),
      passwordController.text.trim(),
    );

    if (user != null) {
      if (user.role == "police") {
        Navigator.pushReplacement(
          context,
          MaterialPageRoute(
              builder: (_) => PoliceDashboard(token: user.token)),
        );
      } else {
        Navigator.pushReplacement(
          context,
          MaterialPageRoute(
              builder: (_) => ExternedDashboard()),
        );
      }
    } else {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text("Login failed")),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Padding(
        padding: EdgeInsets.all(20),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Text("Tadipaar Login", style: TextStyle(fontSize: 24)),
            SizedBox(height: 20),
            TextField(
              controller: mobileController,
              decoration: InputDecoration(labelText: "Mobile Number"),
            ),
            TextField(
              controller: passwordController,
              obscureText: true,
              decoration: InputDecoration(labelText: "Password"),
            ),
            SizedBox(height: 20),
            ElevatedButton(
              onPressed: loginUser,
              child: Text("Login"),
            ),
          ],
        ),
      ),
    );
  }
}