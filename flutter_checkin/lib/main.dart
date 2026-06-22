import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'models/checkin_event.dart';
import 'screens/login_screen.dart';
import 'screens/scanner_screen.dart';

void main() {
  runApp(const JumancoCheckinApp());
}

class JumancoCheckinApp extends StatelessWidget {
  const JumancoCheckinApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: "JUMAN'CO Check-In",
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        colorSchemeSeed: const Color(0xFFE7A81D),
        useMaterial3: true,
        cardTheme: const CardThemeData(surfaceTintColor: Colors.transparent),
      ),
      home: const _AuthGate(),
    );
  }
}

class _AuthGate extends StatefulWidget {
  const _AuthGate();

  @override
  State<_AuthGate> createState() => _AuthGateState();
}

class _AuthGateState extends State<_AuthGate> {
  bool _loading = true;
  String? _displayName;

  @override
  void initState() {
    super.initState();
    _checkSession();
  }

  Future<void> _checkSession() async {
    final prefs = await SharedPreferences.getInstance();
    final user = prefs.getString('logged_in_user');
    final displayName = prefs.getString('logged_in_display_name');
    setState(() {
      _displayName = user != null ? (displayName ?? user) : null;
      _loading = false;
    });
  }

  @override
  Widget build(BuildContext context) {
    if (_loading) {
      return const Scaffold(
        backgroundColor: Color(0xFF1A1209),
        body: Center(
          child: CircularProgressIndicator(color: Color(0xFFFFD42D)),
        ),
      );
    }
    if (_displayName == null) {
      return const LoginScreen();
    }
    return ScannerScreen(
      event: kCheckinEvents.first,
      organizer: _displayName!,
    );
  }
}
