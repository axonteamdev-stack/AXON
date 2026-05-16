import 'package:Axon/features/auth/data/models/error_Dm.dart';
import 'package:Axon/features/auth/data/models/login_response_DM.dart';
import 'package:Axon/features/auth/data/models/medical_profile_DM.dart';
import 'package:Axon/features/auth/domain/entities/register_response_patient_entity.dart';
import 'package:Axon/features/auth/domain/entities/user_entity.dart';

class RegisterResponsePatientDm
    extends RegisterPatientEntity {

  final String? stack;

  const RegisterResponsePatientDm({
    super.data,
    super.error,
    super.message,
    super.success,
    this.stack,
  });

  factory RegisterResponsePatientDm.fromJson(
      Map<String, dynamic> json) {

    return RegisterResponsePatientDm(

      success: json['success'],

      message: json['message'],

      stack: json['stack'],

      error: json['error'] != null
          ? ErrorDM.fromJson(json['error'])
          : null,

      data: json['data'] != null
          ? RegisterPatientDataDM.fromJson(json['data'])
          : null,
    );
  }
}

class RegisterPatientDataDM
    extends RegisterPatientDataEntity {

  RegisterPatientDataDM({
    super.user,
    super.tokens,
  });

  factory RegisterPatientDataDM.fromJson(
      Map<String, dynamic> json) {

    return RegisterPatientDataDM(

      user: json['user'] != null
          ? PatientUserDM.fromJson(json['user'])
          : null,

      tokens: json['tokens'] != null
          ? TokensDM.fromJson(json['tokens'])
          : null,
    );
  }
}

class PatientUserDM extends UserEntity {

  PatientUserDM({
    super.fullName,
    super.email,
    super.phoneNumber,
    super.gender,
    super.personalPhoto,
    super.role,
    super.isVerified,
    super.medicalProfile,
    super.id,
    super.createdAt,
    super.updatedAt,
  });

  factory PatientUserDM.fromJson(
      Map<String, dynamic> json) {

    return PatientUserDM(

      fullName: json['fullName'],

      email: json['email'],

      personalPhoto: json['personalPhoto'],

      phoneNumber: json['phoneNumber'],

      role: json['role'],

      gender: json['gender'],

      isVerified: json['isVerified'],

      medicalProfile: json['profile'] != null
          ? MedicalProfileDM.fromJson(json['profile'])
          : null,

      id: json['_id'],

      createdAt: json['createdAt'],

      updatedAt: json['updatedAt'],
    );
  }
}