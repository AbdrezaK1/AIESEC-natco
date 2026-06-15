import 'package:flutter/material.dart';

class CheckinEvent {
  final String id;
  final String name;
  final String emoji;
  final Color color;
  final String category;

  const CheckinEvent({
    required this.id,
    required this.name,
    required this.emoji,
    required this.color,
    required this.category,
  });
}

final List<CheckinEvent> kCheckinEvents = [
  CheckinEvent(
    id: 'arrival',
    name: 'Arrival',
    emoji: '🏁',
    color: const Color(0xFF1A73E8),
    category: 'Main',
  ),
  CheckinEvent(
    id: 'session_1',
    name: 'Session 1',
    emoji: '🎤',
    color: const Color(0xFF7B2FBE),
    category: 'Sessions',
  ),
  CheckinEvent(
    id: 'session_2',
    name: 'Session 2',
    emoji: '🎤',
    color: const Color(0xFF7B2FBE),
    category: 'Sessions',
  ),
  CheckinEvent(
    id: 'session_3',
    name: 'Session 3',
    emoji: '🎤',
    color: const Color(0xFF7B2FBE),
    category: 'Sessions',
  ),
  CheckinEvent(
    id: 'workshop_1',
    name: 'Workshop 1',
    emoji: '🛠️',
    color: const Color(0xFFE65100),
    category: 'Workshops',
  ),
  CheckinEvent(
    id: 'workshop_2',
    name: 'Workshop 2',
    emoji: '🛠️',
    color: const Color(0xFFE65100),
    category: 'Workshops',
  ),
  CheckinEvent(
    id: 'workshop_3',
    name: 'Workshop 3',
    emoji: '🛠️',
    color: const Color(0xFFE65100),
    category: 'Workshops',
  ),
  CheckinEvent(
    id: 'lunch',
    name: 'Lunch',
    emoji: '🍽️',
    color: const Color(0xFF2E7D32),
    category: 'Meals',
  ),
  CheckinEvent(
    id: 'dinner',
    name: 'Dinner',
    emoji: '🌙',
    color: const Color(0xFF1565C0),
    category: 'Meals',
  ),
  CheckinEvent(
    id: 'coffee_break_1',
    name: 'Coffee Break 1',
    emoji: '☕',
    color: const Color(0xFF795548),
    category: 'Breaks',
  ),
  CheckinEvent(
    id: 'coffee_break_2',
    name: 'Coffee Break 2',
    emoji: '☕',
    color: const Color(0xFF795548),
    category: 'Breaks',
  ),
  CheckinEvent(
    id: 'fun_space_1',
    name: 'Fun Space 1',
    emoji: '🎉',
    color: const Color(0xFFF50057),
    category: 'Fun',
  ),
  CheckinEvent(
    id: 'fun_space_2',
    name: 'Fun Space 2',
    emoji: '🎉',
    color: const Color(0xFFF50057),
    category: 'Fun',
  ),
  CheckinEvent(
    id: 'special_event',
    name: 'Special Event',
    emoji: '⭐',
    color: const Color(0xFFF9A825),
    category: 'Special',
  ),
];
