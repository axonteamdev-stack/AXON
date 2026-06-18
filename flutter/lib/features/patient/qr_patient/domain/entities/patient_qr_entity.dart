class QrPatientEntity {
  final String id;
  final String fullName;
  final String email;
  final String phoneNumber;
  final String gender;
  final String? personalPhoto;

  final String bloodType;
  final double height;
  final double weight;

  final List<String> conditions;
  final List<String> allergies;

  final String emergencyName;
  final String emergencyPhone;

  const QrPatientEntity({
    required this.id,
    required this.fullName,
    required this.email,
    required this.phoneNumber,
    required this.gender,
    required this.personalPhoto,
    required this.bloodType,
    required this.height,
    required this.weight,
    required this.conditions,
    required this.allergies,
    required this.emergencyName,
    required this.emergencyPhone,
  });
}