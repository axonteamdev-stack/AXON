import 'package:Axon/features/auth/data/models/error_response_Dm.dart';
import 'package:Axon/features/auth/domain/entities/medical_profile_entity.dart';
import 'package:Axon/features/auth/domain/entities/register_response_patient_entity.dart';

class RegisterResponsePatientDm extends RegisterPatientEntity {
  final String? stack;
  RegisterResponsePatientDm({
    super.data,
    super.error,
    super.message,
    super.status,
    this.stack,
  });

  factory RegisterResponsePatientDm.fromJson(Map<String, dynamic> json) {
    return RegisterResponsePatientDm(
      status: json['status'],
      error: json['error'] != null
          ? ErrorResponseDM.fromJson(json['error'])
          : null,
      message: json['message'],
      data: json['data'] != null ? PatientDataDM.fromJson(json['data']) : null,
      stack: json['stack'],
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
          : null,
      id: json['id'],
      createdAt: json['createdAt'],
      updatedAt: json['updatedAt'],
    );
  }
}

class MedicalProfileDM extends MedicalProfileEntity {
  MedicalProfileDM({
    super.bloodType,
    super.height,
    super.weight,
    super.conditions,
    super.allergies,
    super.radiologyTests,
    super.labTests,
  });

  factory MedicalProfileDM.fromJson(Map<String, dynamic> json) {
    return MedicalProfileDM(
      bloodType: json['bloodType'],
      height: json['height'],
      weight: json['weight'],
      conditions: json['conditions'],
      allergies: json['allergies'],
      radiologyTests: json['radiologyTests'] != null
          ? (json['radiologyTests'] as List)
                .map((e) => RadiologyTestDM.fromJson(e))
                .toList()
          : null,
      labTests: json['labTests'] != null
          ? (json['labTests'] as List)
                .map((e) => LabTestDM.fromJson(e))
                .toList()
          : null,
    );
  }
}

class RadiologyTestDM extends RadiologyTestEntity {
  RadiologyTestDM({super.id, super.image, super.description, super.date});
  factory RadiologyTestDM.fromJson(Map<String, dynamic> json) {
    return RadiologyTestDM(
      id: json['id'],
      image: json['image'],
      description: json['description'],
      date: json['date'],
    );
  }
}

class LabTestDM extends LabTestEntity {
  LabTestDM({super.id, super.image, super.description, super.uploadedAt});

  factory LabTestDM.fromJson(Map<String, dynamic> json) {
    return LabTestDM(
      id: json['id'],
      image: json['image'],
      description: json['description'],
      uploadedAt: json['uploadedAt'],
    );
  }
}

