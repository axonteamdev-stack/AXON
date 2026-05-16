import 'package:Axon/features/auth/data/models/doctor_profile_DM.dart';
import 'package:Axon/features/auth/data/models/error_Dm.dart';
import 'package:Axon/features/auth/data/models/medical_profile_DM.dart';
import 'package:Axon/features/auth/domain/entities/login_response_entity.dart';
import 'package:Axon/features/auth/domain/entities/user_entity.dart';

class LoginResponseDM extends LoginResponseEntity {
  const LoginResponseDM({
    super.success,
    super.message,
    super.data,
    super.error,
  });

  factory LoginResponseDM.fromJson(Map<String, dynamic> json) {
    return LoginResponseDM(
      success: json['success'],
      message: json['message'],
      error:
          json['error'] != null ? ErrorDM.fromJson(json['error']) : null,
      data: json['data'] != null
          ? LoginDataDM.fromJson(json['data'])
          : null,
    );
  }
}

class LoginDataDM extends LoginDataEntity {
  LoginDataDM({
    super.user,
    super.tokens,
  });

  factory LoginDataDM.fromJson(Map<String, dynamic> json) {
    return LoginDataDM(
      user: json['user'] != null
          ? UserDM.fromJson(json['user'])
          : null,
      tokens: json['tokens'] != null
          ? TokensDM.fromJson(json['tokens'])
          : null,
    );
  }
}

class TokensDM extends TokensEntity {
  TokensDM({
    super.accessToken,
    super.refreshToken,
  });

  factory TokensDM.fromJson(Map<String, dynamic> json) {
    return TokensDM(
      accessToken: json['accessToken'],
      refreshToken: json['refreshToken'],
    );
  }
}

class UserDM extends UserEntity {
  UserDM({
    super.id,
    super.fullName,
    super.email,
    super.phoneNumber,
    super.gender,
    super.personalPhoto,
    super.role,
    super.isVerified,
    super.createdAt,
    super.updatedAt,
    super.doctorProfile,
    super.medicalProfile,
  });

  factory UserDM.fromJson(Map<String, dynamic> json) {
    return UserDM(
      id: json['_id'],
      fullName: json['fullName'],
      email: json['email'],
      phoneNumber: json['phoneNumber'],
      gender: json['gender'],
      personalPhoto: json['personalPhoto'],
      role: json['role'],
      isVerified: json['isVerified'],
      createdAt: json['createdAt'],
      updatedAt: json['updatedAt'],

      doctorProfile: json['doctorProfile'] != null
          ? DoctorProfileDM.fromJson(json['doctorProfile'])
          : null,

      medicalProfile: json['medicalProfile'] != null
          ? MedicalProfileDM.fromJson(json['medicalProfile'])
          : null,
    );
  }
}