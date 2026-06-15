class Delegate {
  final String id;
  final String fullName;
  final String lc;
  final String department;
  final String position;
  final String phone;
  final String email;
  final String pictureUrl;
  final String allergies;
  final String comingFor;

  const Delegate({
    required this.id,
    required this.fullName,
    required this.lc,
    required this.department,
    required this.position,
    required this.phone,
    required this.email,
    required this.pictureUrl,
    required this.allergies,
    required this.comingFor,
  });

  factory Delegate.fromJson(Map<String, dynamic> json) {
    final rawPicture = json['pictureUrl']?.toString() ?? '';
    final validPicture = rawPicture.startsWith('http') ? rawPicture : '';

    return Delegate(
      id: json['id']?.toString() ?? '',
      fullName: json['fullName']?.toString() ?? '',
      lc: json['lc']?.toString() ?? '',
      department: json['department']?.toString() ?? '',
      position: json['position']?.toString() ?? '',
      phone: json['phone']?.toString() ?? '',
      email: json['email']?.toString() ?? '',
      pictureUrl: validPicture,
      allergies: json['allergies']?.toString() ?? '',
      comingFor: json['comingFor']?.toString() ?? '',
    );
  }
}
