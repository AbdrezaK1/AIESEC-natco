import 'package:flutter/material.dart';
import '../models/delegate.dart';
import '../models/checkin_event.dart';

class ResultScreen extends StatelessWidget {
  final Delegate delegate;
  final CheckinEvent event;
  final bool alreadyCheckedIn;

  const ResultScreen({
    super.key,
    required this.delegate,
    required this.event,
    required this.alreadyCheckedIn,
  });

  @override
  Widget build(BuildContext context) {
    final isWarning = alreadyCheckedIn;
    final color = isWarning ? const Color(0xFFF9A825) : const Color(0xFF2E7D32);
    final icon = isWarning ? Icons.warning_amber_rounded : Icons.check_circle_rounded;
    final label = isWarning ? 'Already Checked In' : 'Check-In Successful';

    return Scaffold(
      backgroundColor: color,
      body: SafeArea(
        child: Column(
          children: [
            Expanded(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Icon(icon, size: 96, color: Colors.white),
                  const SizedBox(height: 16),
                  Text(
                    label,
                    style: const TextStyle(
                      color: Colors.white,
                      fontSize: 24,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  const SizedBox(height: 8),
                  Text(
                    '${event.emoji} ${event.name}',
                    style: const TextStyle(color: Colors.white70, fontSize: 16),
                  ),
                ],
              ),
            ),
            Container(
              margin: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(20),
              ),
              child: Column(
                children: [
                  const SizedBox(height: 24),
                  if (delegate.pictureUrl.isNotEmpty)
                    CircleAvatar(
                      radius: 48,
                      backgroundImage: NetworkImage(delegate.pictureUrl),
                      backgroundColor: Colors.grey[200],
                    )
                  else
                    CircleAvatar(
                      radius: 48,
                      backgroundColor: color.withAlpha(40),
                      child: Text(
                        delegate.fullName.isNotEmpty ? delegate.fullName[0] : '?',
                        style: TextStyle(fontSize: 40, color: color),
                      ),
                    ),
                  const SizedBox(height: 16),
                  Text(
                    delegate.fullName,
                    style: const TextStyle(fontSize: 22, fontWeight: FontWeight.bold),
                    textAlign: TextAlign.center,
                  ),
                  const SizedBox(height: 4),
                  Text(
                    '${delegate.position} · ${delegate.lc}',
                    style: const TextStyle(color: Colors.black54, fontSize: 14),
                    textAlign: TextAlign.center,
                  ),
                  const Divider(height: 32, indent: 24, endIndent: 24),
                  _InfoRow(label: 'Department', value: delegate.department),
                  _InfoRow(label: 'Email', value: delegate.email),
                  _InfoRow(label: 'Phone', value: delegate.phone),
                  if (delegate.allergies.isNotEmpty)
                    _InfoRow(
                      label: 'Allergies',
                      value: delegate.allergies,
                      valueColor: Colors.red[700],
                    ),
                  const SizedBox(height: 24),
                ],
              ),
            ),
            Padding(
              padding: const EdgeInsets.fromLTRB(16, 0, 16, 24),
              child: FilledButton.icon(
                style: FilledButton.styleFrom(
                  backgroundColor: Colors.white,
                  foregroundColor: color,
                  minimumSize: const Size.fromHeight(52),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                ),
                icon: const Icon(Icons.qr_code_scanner),
                label: const Text('Scan Next', style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
                onPressed: () => Navigator.pop(context),
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _InfoRow extends StatelessWidget {
  const _InfoRow({required this.label, required this.value, this.valueColor});

  final String label;
  final String value;
  final Color? valueColor;

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 6),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          SizedBox(
            width: 100,
            child: Text(label, style: const TextStyle(color: Colors.black45, fontSize: 13)),
          ),
          Expanded(
            child: Text(
              value.isEmpty ? '—' : value,
              style: TextStyle(
                fontWeight: FontWeight.w600,
                fontSize: 14,
                color: valueColor,
              ),
            ),
          ),
        ],
      ),
    );
  }
}
