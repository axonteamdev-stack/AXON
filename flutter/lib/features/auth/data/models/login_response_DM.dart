import 'package:Axon/features/auth/data/models/doctor_profile_DM.dart';
import 'package:Axon/features/auth/data/models/error_Dm.dart';
import 'package:Axon/features/auth/data/models/medical_profile_DM.dart';
import 'package:Axon/features/auth/domain/entities/login_response_entity.dart';
import 'package:Axon/features/auth/domain/entities/user_entity.dart';

class LoginResponseDM extends LoginResponseEntity {
  const LoginResponseDM({
    super.status,
    super.message,
    super.data,
    super.error,
  });

  factory LoginResponseDM.fromJson(Map<String, dynamic> json) {
    return LoginResponseDM(
      status: json['status'],
      message: json['message'],
      error: json['error'] != null
          ? ErrorDM.fromJson(json['error'])
          : null,
      data: json['data'] != null
          ? UserDM.fromJson(json['data'])
          : null,
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