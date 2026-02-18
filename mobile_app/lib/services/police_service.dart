import 'dart:convert';
import 'package:http/http.dart' as http;
import '../utils/constants.dart';

class PoliceService {

  Future<bool> createExterned(
      String token,
      String fullName,
      String mobile,
      String password,
      String caseId,
      String city) async {

    final response = await http.post(
      Uri.parse("${AppConstants.baseUrl}/admin/create-externed"),
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer $token"
      },
      body: jsonEncode({
        "full_name": fullName,
        "mobile_number": mobile,
        "password": password,
        "case_id": caseId,
        "assigned_city": city
      }),
    );

    return response.statusCode == 201;
  }
}