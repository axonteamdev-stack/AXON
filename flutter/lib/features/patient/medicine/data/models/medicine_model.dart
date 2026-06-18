import 'package:Axon/features/patient/medicine/domain/entities/medicine_entity.dart';

class MedicineModel extends MedicineEntity {
  const MedicineModel({
    required super.success,
    required super.message,
    required super.data,
  });

  factory MedicineModel.fromJson(Map<String, dynamic> json) {
    return MedicineModel(
      success: json["success"] ?? false,
      message: json["message"] ?? "",
      data: MedicineDataModel.fromJson(json["data"] ?? {}),
    );
  }
}

class MedicineDataModel extends MedicineDataEntity {
  const MedicineDataModel({
    required super.medication,
  });

  factory MedicineDataModel.fromJson(Map<String, dynamic> json) {
    return MedicineDataModel(
      medication: MedicationModel.fromJson(json["medication"] ?? {}),
    );
  }
}

class MedicationModel extends MedicationEntity {
  const MedicationModel({
    required super.patientId,
    required super.medicineName,
    required super.dosage,
    required super.frequency,
    required super.intakeTimes,
    required super.startDate,
    required super.endDate,
    required super.indication,
    required super.notes,
    required super.isActive,
    required super.id,
    required super.createdAt,
    required super.updatedAt,
    required super.version,
  });

  factory MedicationModel.fromJson(Map<String, dynamic> json) {
    return MedicationModel(
      patientId: json["patientId"] ?? "",
      medicineName: json["medicineName"] ?? "",
      dosage: DosageModel.fromJson(json["dosage"] ?? {}),
      frequency: json["frequency"] ?? "",
      intakeTimes: List<String>.from(json["intakeTimes"] ?? []),
      startDate: json["startDate"] ?? "",
      endDate: json["endDate"] ?? "",
      indication: json["indication"] ?? "",
      notes: json["notes"] ?? "",
      isActive: json["isActive"] ?? false,
      id: json["_id"] ?? "",
      createdAt: json["createdAt"] ?? "",
      updatedAt: json["updatedAt"] ?? "",
      version: json["__v"] ?? 0,
    );
  }
}

class DosageModel extends DosageEntity {
  const DosageModel({
    required super.value,
    required super.unit,
  });

  factory DosageModel.fromJson(Map<String, dynamic> json) {
    return DosageModel(
      value: json["value"] ?? 0,
      unit: json["unit"] ?? "",
    );
  }
}