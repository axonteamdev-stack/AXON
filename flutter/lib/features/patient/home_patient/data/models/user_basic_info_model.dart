import 'package:Axon/features/patient/home_patient/domain/entities/user_basic_info_entity.dart';

class UserBasicInfoModel extends UserBasicInfoEntity {
  const UserBasicInfoModel({
    required super.id,
    required super.fullName,
    required super.email,
    required super.phoneNumber,
    required super.gender,
    super.personalPhoto,
    required super.role,
    required super.isVerified,
    required super.preferredLanguage,
  });

  factory UserBasicInfoModel.fromJson(Map<String, dynamic> json) {
    final user = json["data"]["user"];

    return UserBasicInfoModel(
      id: user["id"] ?? "",
      fullName: user["fullName"] ?? "",
      email: user["email"] ?? "",
      phoneNumber: user["phoneNumber"] ?? "",
      gender: user["gender"] ?? "",
      personalPhoto: user["personalPhoto"],
      role: user["role"] ?? "",
      isVerified: user["isVerified"] ?? false,
      preferredLanguage: user["preferredLanguage"] ?? "",
    );
  }
}