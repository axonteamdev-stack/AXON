class UserBasicInfoEntity {
  final String id;
  final String fullName;
  final String email;
  final String phoneNumber;
  final String gender;
  final String? personalPhoto;
  final String role;
  final bool isVerified;
  final String preferredLanguage;

  const UserBasicInfoEntity({
    required this.id,
    required this.fullName,
    required this.email,
    required this.phoneNumber,
    required this.gender,
    this.personalPhoto,
    required this.role,
    required this.isVerified,
    required this.preferredLanguage,
  });
}