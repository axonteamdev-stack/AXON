import 'package:Axon/features/auth/data/models/error_Dm.dart';
import 'package:Axon/features/auth/data/models/medical_profile_DM.dart';
import 'package:Axon/features/auth/domain/entities/medical_profile_entity.dart';
import 'package:Axon/features/auth/domain/entities/register_response_patient_entity.dart';

class RegisterResponsePatientDm extends RegisterPatientEntity {
  final String? stack;

  RegisterResponsePatientDm({
    super.data,
    super.error,
    super.message,
    super.success,
    this.stack,
  });

  factory RegisterResponsePatientDm.fromJson(Map<String, dynamic> json) {
    return RegisterResponsePatientDm(
      success: json['status'],
      message: json['message'],
      stack: json['stack'],
      error: json['error'] != null
          ? ErrorDM.fromJson(json['error'])
          : null,
      data: json['data'] != null
          ? PatientDataDM.fromJson(json['data'])
          : null,
    );
  }
}

class PatientDataDM extends PatientDataEntity {
  PatientDataDM({
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

  factory PatientDataDM.fromJson(Map<String, dynamic> json) {
    return PatientDataDM(
      fullName: json['fullName'],
      email: json['email'],
      personalPhoto: json['personalPhoto'],
      phoneNumber: json['phoneNumber'],
      role: json['role'],
      gender: json['gender'],
      isVerified: json['isVerified'],
      medicalProfile: json['medicalProfile'] != null
          ? MedicalProfileDM.fromJson(json['medicalProfile'])
              as MedicalProfileEntity
          : null,
      id: json['_id'],
      createdAt: json['createdAt'],
      updatedAt: json['updatedAt'],
    );
  }
}