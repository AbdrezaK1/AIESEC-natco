import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';
import '../models/delegate.dart';

class ApiService {
  static const _baseUrlKey = 'api_base_url';
  static const _defaultBaseUrl = 'https://your-app.vercel.app';

  static Future<String> getBaseUrl() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getString(_baseUrlKey) ?? _defaultBaseUrl;
  }

  static Future<void> setBaseUrl(String url) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString(_baseUrlKey, url.trimRight().replaceAll(RegExp(r'/$'), ''));
  }

  static Future<({Delegate delegate, bool alreadyCheckedIn})> lookupDelegate(
    String delegateId,
    String eventId,
  ) async {
    final base = await getBaseUrl();
    final uri = Uri.parse('$base/api/checkin/lookup').replace(
      queryParameters: {'id': delegateId, 'event': eventId},
    );

    final response = await http.get(uri).timeout(const Duration(seconds: 10));

    if (response.statusCode == 404) {
      throw Exception('Delegate not found');
    }
    if (response.statusCode != 200) {
      throw Exception('Server error ${response.statusCode}');
    }

    final json = jsonDecode(response.body) as Map<String, dynamic>;
    return (
      delegate: Delegate.fromJson(json['delegate'] as Map<String, dynamic>),
      alreadyCheckedIn: json['alreadyCheckedIn'] as bool? ?? false,
    );
  }

  static Future<void> recordCheckin({
    required String delegateId,
    required String eventId,
    required String eventName,
    required String organizer,
  }) async {
    final base = await getBaseUrl();
    final uri = Uri.parse('$base/api/checkin');

    final response = await http.post(
      uri,
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({
        'delegateId': delegateId,
        'eventId': eventId,
        'eventName': eventName,
        'organizer': organizer,
      }),
    ).timeout(const Duration(seconds: 10));

    if (response.statusCode != 200) {
      final json = jsonDecode(response.body) as Map<String, dynamic>;
      throw Exception(json['error'] ?? 'Failed to record check-in');
    }
  }
}
