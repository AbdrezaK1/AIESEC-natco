import 'package:flutter/material.dart';
import 'package:mobile_scanner/mobile_scanner.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../models/checkin_event.dart';
import '../services/api_service.dart';
import 'result_screen.dart';

class ScannerScreen extends StatefulWidget {
  final CheckinEvent event;

  const ScannerScreen({super.key, required this.event});

  @override
  State<ScannerScreen> createState() => _ScannerScreenState();
}

class _ScannerScreenState extends State<ScannerScreen> {
  final MobileScannerController _controller = MobileScannerController();
  bool _processing = false;
  String? _error;

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  Future<void> _onDetect(BarcodeCapture capture) async {
    if (_processing) return;
    final raw = capture.barcodes.firstOrNull?.rawValue;
    if (raw == null || raw.isEmpty) return;

    setState(() {
      _processing = true;
      _error = null;
    });
    await _controller.stop();

    try {
      final prefs = await SharedPreferences.getInstance();
      final organizer = prefs.getString('organizer_name') ?? 'Unknown';

      final result = await ApiService.lookupDelegate(raw, widget.event.id);

      if (!result.alreadyCheckedIn) {
        await ApiService.recordCheckin(
          delegateId: raw,
          eventId: widget.event.id,
          eventName: widget.event.name,
          organizer: organizer,
        );
      }

      if (!mounted) return;
      await Navigator.push(
        context,
        MaterialPageRoute(
          builder: (_) => ResultScreen(
            delegate: result.delegate,
            event: widget.event,
            alreadyCheckedIn: result.alreadyCheckedIn,
          ),
        ),
      );
    } catch (e) {
      if (!mounted) return;
      setState(() => _error = e.toString().replaceFirst('Exception: ', ''));
    } finally {
      if (mounted) {
        setState(() => _processing = false);
        await _controller.start();
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    final event = widget.event;
    return Scaffold(
      backgroundColor: Colors.black,
      appBar: AppBar(
        backgroundColor: Colors.black,
        foregroundColor: Colors.white,
        title: Row(
          children: [
            Text(event.emoji, style: const TextStyle(fontSize: 20)),
            const SizedBox(width: 8),
            Text(event.name, style: const TextStyle(color: Colors.white)),
          ],
        ),
        actions: [
          IconButton(
            icon: const Icon(Icons.flash_on),
            onPressed: _controller.toggleTorch,
            tooltip: 'Toggle torch',
          ),
        ],
      ),
      body: Stack(
        children: [
          MobileScanner(controller: _controller, onDetect: _onDetect),
          // Viewfinder overlay
          Center(
            child: Container(
              width: 260,
              height: 260,
              decoration: BoxDecoration(
                border: Border.all(color: event.color, width: 3),
                borderRadius: BorderRadius.circular(16),
              ),
            ),
          ),
          // Bottom status bar
          Positioned(
            left: 0,
            right: 0,
            bottom: 0,
            child: _BottomBar(
              processing: _processing,
              error: _error,
              eventColor: event.color,
            ),
          ),
        ],
      ),
    );
  }
}

class _BottomBar extends StatelessWidget {
  const _BottomBar({
    required this.processing,
    required this.error,
    required this.eventColor,
  });

  final bool processing;
  final String? error;
  final Color eventColor;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.fromLTRB(24, 20, 24, 36),
      decoration: BoxDecoration(
        gradient: LinearGradient(
          begin: Alignment.bottomCenter,
          end: Alignment.topCenter,
          colors: [Colors.black.withAlpha(220), Colors.transparent],
        ),
      ),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          if (processing)
            Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                SizedBox(
                  width: 20,
                  height: 20,
                  child: CircularProgressIndicator(
                    strokeWidth: 2,
                    valueColor: AlwaysStoppedAnimation(eventColor),
                  ),
                ),
                const SizedBox(width: 12),
                const Text('Looking up delegate…', style: TextStyle(color: Colors.white)),
              ],
            )
          else if (error != null)
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
              decoration: BoxDecoration(
                color: Colors.red[700],
                borderRadius: BorderRadius.circular(12),
              ),
              child: Row(
                children: [
                  const Icon(Icons.error_outline, color: Colors.white),
                  const SizedBox(width: 12),
                  Expanded(
                    child: Text(
                      error!,
                      style: const TextStyle(color: Colors.white),
                    ),
                  ),
                ],
              ),
            )
          else
            const Text(
              'Point camera at a delegate QR code',
              style: TextStyle(color: Colors.white70, fontSize: 14),
              textAlign: TextAlign.center,
            ),
        ],
      ),
    );
  }
}
