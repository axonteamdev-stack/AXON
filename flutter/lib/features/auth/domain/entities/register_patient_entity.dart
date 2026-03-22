class RegisterPatientEntity {
  final String? status;
  final PatientDataEntity? data;
  final ErrorPatientEntity? error;
  final String? message;


  RegisterPatientEntity({this.status, this.data ,this.error, this.message});
}

class PatientDataEntity {
  final String? fullName;
  final String? email;
  final String? phoneNumber;
  final String? gender;
  final String? personalPhoto;
  final String? role;
  final bool? isVerified;
  final MedicalProfileEntity? medicalProfile;
  final String? id;
  final String? createdAt;
  final String? updatedAt;

  PatientDataEntity({
    this.fullName,
    this.email,
    this.phoneNumber,
    this.gender,
    this.personalPhoto,
    this.role,
    this.isVerified,
    this.medicalProfile,
    this.id,
    this.createdAt,
    this.updatedAt,
  });
}

class MedicalProfileEntity {
  final String? bloodType;
  final int? height;
  final int? weight;
  final List<String>? conditions;
  final List<String>? allergies;
  final List<RadiologyTestEntity>? radiologyTests;
  final List<LabTestEntity>? labTests;

  MedicalProfileEntity({
    this.bloodType,
    this.height,
    this.weight,
    this.conditions,
    this.allergies,
    this.radiologyTests,
    this.labTests,
  });
}

class RadiologyTestEntity {
  final String? id;
  final String? image;
  final String? description;
  final String? date;

  RadiologyTestEntity({this.id, this.image, this.description, this.date});
}

class LabTestEntity {
  final String? id;
  final String? image;
  final String? description;
  final String? uploadedAt;

  LabTestEntity({this.id, this.image, this.description, this.uploadedAt});
}

class ErrorPatientEntity {
  int? statusCode;
  String? status;
  bool? isOperational;

  ErrorPatientEntity({this.statusCode, this.status, this.isOperational});
}
