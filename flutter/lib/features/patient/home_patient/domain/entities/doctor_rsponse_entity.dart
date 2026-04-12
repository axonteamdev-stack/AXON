class DoctorRsponseEntity {
  final String id;
  final String fullName;
  final String? personalPhoto;

  const DoctorRsponseEntity({
    required this.id,
    required this.fullName,
    this.personalPhoto,
  });
}