import 'package:flutter/material.dart';
import 'screens/home_screen.dart';

void main() {
  runApp(const JumancoCheckinApp());
}

class JumancoCheckinApp extends StatelessWidget {
  const JumancoCheckinApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'JUMANCO Check-In',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        colorSchemeSeed: const Color(0xFF037EF3),
        useMaterial3: true,
        cardTheme: const CardThemeData(
          surfaceTintColor: Colors.transparent,
        ),
      ),
      home: const HomeScreen(),
    );
  }
}
