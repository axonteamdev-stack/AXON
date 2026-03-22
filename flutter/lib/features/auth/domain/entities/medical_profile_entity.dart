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
