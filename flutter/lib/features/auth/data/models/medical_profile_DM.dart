import 'package:Axon/features/auth/domain/entities/medical_profile_entity.dart';

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
      conditions: (json['conditions'] as List?)?.cast<String>(),
      allergies: (json['allergies'] as List?)?.cast<String>(),
      radiologyTests: (json['radiologyTests'] as List?)
          ?.map((e) => RadiologyTestDM.fromJson(e))
          .toList(),
      labTests: (json['labTests'] as List?)
          ?.map((e) => LabTestDM.fromJson(e))
          .toList(),
    );
  }
}

class RadiologyTestDM extends RadiologyTestEntity {
  RadiologyTestDM({
    super.id,
    super.image,
    super.description,
    super.date,
  });

  factory RadiologyTestDM.fromJson(Map<String, dynamic> json) {
    return RadiologyTestDM(
      id: json['_id'],
      image: json['image'],
      description: json['description'],
      date: json['date'],
    );
  }
}

class LabTestDM extends LabTestEntity {
  LabTestDM({
    super.id,
    super.image,
    super.description,
    super.uploadedAt,
  });

  factory LabTestDM.fromJson(Map<String, dynamic> json) {
    return LabTestDM(
      id: json['_id'],
      image: json['image'],
      description: json['description'],
      uploadedAt: json['uploadedAt'],
    );
  }
}