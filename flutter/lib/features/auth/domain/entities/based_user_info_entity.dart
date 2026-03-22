class BasedUserInfoEntity {
  final String? id;
  final String? fullName;
  final String? email;
  final String? phoneNumber;
  final String? gender;
  final String? personalPhoto;
  final String? role;
  final bool? isVerified;

  final String? createdAt;
  final String? updatedAt;

  const BasedUserInfoEntity({
    this.id,
    this.fullName,
    this.email,
    this.phoneNumber,
    this.gender,
    this.personalPhoto,
    this.role,
    this.isVerified,
    this.createdAt,
    this.updatedAt,
  });
}