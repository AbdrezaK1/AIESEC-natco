import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../services/api_service.dart';

class SettingsScreen extends StatefulWidget {
  const SettingsScreen({super.key});

  @override
  State<SettingsScreen> createState() => _SettingsScreenState();
}

class _SettingsScreenState extends State<SettingsScreen> {
  final _urlController = TextEditingController();
  final _nameController = TextEditingController();
  static const _nameKey = 'organizer_name';
  bool _saved = false;

  @override
  void initState() {
    super.initState();
    _load();
  }

  Future<void> _load() async {
    final prefs = await SharedPreferences.getInstance();
    _urlController.text = await ApiService.getBaseUrl();
    _nameController.text = prefs.getString(_nameKey) ?? '';
  }

  Future<void> _save() async {
    final prefs = await SharedPreferences.getInstance();
    await ApiService.setBaseUrl(_urlController.text.trim());
    await prefs.setString(_nameKey, _nameController.text.trim());
    setState(() => _saved = true);
    await Future.delayed(const Duration(seconds: 2));
    if (mounted) setState(() => _saved = false);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Settings')),
      body: ListView(
        padding: const EdgeInsets.all(24),
        children: [
          const Text('Your Name', style: TextStyle(fontWeight: FontWeight.bold)),
          const SizedBox(height: 8),
          TextField(
            controller: _nameController,
            decoration: const InputDecoration(
              hintText: 'e.g. Ahmed Organizer',
              border: OutlineInputBorder(),
            ),
          ),
          const SizedBox(height: 24),
          const Text('App Server URL', style: TextStyle(fontWeight: FontWeight.bold)),
          const SizedBox(height: 8),
          TextField(
            controller: _urlController,
            keyboardType: TextInputType.url,
            decoration: const InputDecoration(
              hintText: 'https://your-app.vercel.app',
              border: OutlineInputBorder(),
            ),
          ),
          const SizedBox(height: 8),
          Text(
            'Enter the base URL of your deployed Next.js app (no trailing slash).',
            style: Theme.of(context).textTheme.bodySmall,
          ),
          const SizedBox(height: 32),
          FilledButton(
            onPressed: _save,
            child: Text(_saved ? 'Saved!' : 'Save Settings'),
          ),
        ],
      ),
    );
  }

  @override
  void dispose() {
    _urlController.dispose();
    _nameController.dispose();
    super.dispose();
  }
}
