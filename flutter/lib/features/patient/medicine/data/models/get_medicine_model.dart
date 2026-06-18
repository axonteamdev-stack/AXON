import 'package:Axon/features/patient/medicine/domain/entities/get_medicine_entity.dart';

class GetMedicineModel extends GetMedicineEntity {
  const GetMedicineModel({
    required super.success,
    required super.message,
    required super.data,
  });

  factory GetMedicineModel.fromJson(Map<String, dynamic> json) {
    return GetMedicineModel(
      success: json["success"] ?? false,
      message: json["message"] ?? "",
      data: MedicineResponseDataModel.fromJson(
        json["data"] ?? {},
      ),
    );
  }
}

class MedicineResponseDataModel extends MedicineResponseDataEntity {
  const MedicineResponseDataModel({
    required super.medications,
  });

  factory MedicineResponseDataModel.fromJson(
    Map<String, dynamic> json,
  ) {
    return MedicineResponseDataModel(
      medications: (json["medications"] as List<dynamic>? ?? [])
          .map(
            (e) => MedicineDataModel.fromJson(e),
          )
          .toList(),
    );
  }
}

class MedicineDataModel extends MedicineDataEntity {
  const MedicineDataModel({
    required super.dosage,
    required super.id,
    required super.patientId,
    required super.medicineName,
    required super.frequency,
    required super.intakeTimes,
    required super.startDate,
    required super.endDate,
    required super.indication,
    required super.notes,
    required super.isActive,
    required super.createdAt,
    required super.updatedAt,
    required super.stats,
    required super.isExpired,
  });

  factory MedicineDataModel.fromJson(
    Map<String, dynamic> json,
  ) {
    return MedicineDataModel(
      dosage: DosageModel.fromJson(
        json["dosage"] ?? {},
      ),
      id: json["_id"] ?? "",
      patientId: json["patientId"] ?? "",
      medicineName: json["medicineName"] ?? "",
      frequency: json["frequency"] ?? "",
      intakeTimes: List<String>.from(
        json["intakeTimes"] ?? [],
      ),
      startDate: json["startDate"] ?? "",
      endDate: json["endDate"] ?? "",
      indication: json["indication"],
      notes: json["notes"],
      isActive: json["isActive"] ?? false,
      createdAt: json["createdAt"] ?? "",
      updatedAt: json["updatedAt"] ?? "",
      stats: StatsModel.fromJson(
        json["stats"] ?? {},
      ),
      isExpired: json["isExpired"] ?? false,
    );
  }
}

class DosageModel extends DosageEntity {
  const DosageModel({
    required super.value,
    required super.unit,
  });

  factory DosageModel.fromJson(
    Map<String, dynamic> json,
  ) {
    return DosageModel(
      value: json["value"] ?? 0,
      unit: json["unit"] ?? "",
    );
  }
}

class StatsModel extends StatsEntity {
  const StatsModel({
    required super.total,
    required super.pending,
    required super.taken,
    required super.skipped,
  });

  factory StatsModel.fromJson(
    Map<String, dynamic> json,
  ) {
    return StatsModel(
      total: json["total"] ?? 0,
      pending: json["pending"] ?? 0,
      taken: json["taken"] ?? 0,
      skipped: json["skipped"] ?? 0,
    );
  }
}