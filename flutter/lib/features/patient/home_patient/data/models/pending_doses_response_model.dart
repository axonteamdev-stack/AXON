import 'package:Axon/features/patient/home_patient/domain/entities/pending_doses_response_entity.dart';

class PendingDosesResponseModel extends PendingDosesResponseEntity {
  PendingDosesResponseModel({
    required super.success,
    required super.message,
    required PendingDosesDataModel super.data,
  });

  factory PendingDosesResponseModel.fromJson(
    Map<String, dynamic> json,
  ) {
    return PendingDosesResponseModel(
      success: json['success'],
      message: json['message'],
      data: PendingDosesDataModel.fromJson(json['data']),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'success': success,
      'message': message,
      'data': (data as PendingDosesDataModel).toJson(),
    };
  }
}

class PendingDosesDataModel extends PendingDosesDataEntity {
  PendingDosesDataModel({
    required List<DoseModel> super.doses,
  });

  factory PendingDosesDataModel.fromJson(
    Map<String, dynamic> json,
  ) {
    // في حالة الـ API يرجع doses كـ List
    if (json['doses'] != null) {
      return PendingDosesDataModel(
        doses: (json['doses'] as List)
            .map((e) => DoseModel.fromJson(e))
            .toList(),
      );
    }

    // في حالة الـ API يرجع dose واحدة
    if (json['dose'] != null) {
      return PendingDosesDataModel(
        doses: [
          DoseModel.fromJson(json['dose']),
        ],
      );
    }

    // لو مفيش أي جرعات
    return PendingDosesDataModel(
      doses: [],
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'doses': doses
          .map((e) => (e as DoseModel).toJson())
          .toList(),
    };
  }
}

class DoseModel extends DoseEntity {
  DoseModel({
    required super.id,
    required super.patientId,
    required MedicationModel super.medication,
    required super.date,
    required super.time,
    required super.status,
    required super.createdAt,
    required super.updatedAt,
  });

  factory DoseModel.fromJson(Map<String, dynamic> json) {
    return DoseModel(
      id: json['_id'],
      patientId: json['patientId'],
      medication: MedicationModel.fromJson(json['medicationId']),
      date: json['date'],
      time: json['time'],
      status: json['status'],
      createdAt: DateTime.parse(json['createdAt']),
      updatedAt: DateTime.parse(json['updatedAt']),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      '_id': id,
      'patientId': patientId,
      'medicationId': (medication as MedicationModel).toJson(),
      'date': date,
      'time': time,
      'status': status,
      'createdAt': createdAt.toIso8601String(),
      'updatedAt': updatedAt.toIso8601String(),
    };
  }
}

class MedicationModel extends MedicationEntity {
  MedicationModel({
    required super.id,
    required super.medicineName,
    required DosageModel super.dosage,
  });

  factory MedicationModel.fromJson(Map<String, dynamic> json) {
    return MedicationModel(
      id: json['_id'],
      medicineName: json['medicineName'],
      dosage: DosageModel.fromJson(json['dosage']),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      '_id': id,
      'medicineName': medicineName,
      'dosage': (dosage as DosageModel).toJson(),
    };
  }
}

class DosageModel extends DosageEntity {
  DosageModel({
    required super.value,
    required super.unit,
  });

  factory DosageModel.fromJson(Map<String, dynamic> json) {
    return DosageModel(
      value: (json['value'] as num).toDouble(),
      unit: json['unit'],
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'value': value,
      'unit': unit,
    };
  }
}