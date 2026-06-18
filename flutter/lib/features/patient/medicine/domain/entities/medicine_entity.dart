class MedicineEntity {
  final bool success;
  final String message;
  final MedicineDataEntity data;

  const MedicineEntity({
    required this.success,
    required this.message,
    required this.data,
  });
}

class MedicineDataEntity {
  final MedicationEntity medication;

  const MedicineDataEntity({
    required this.medication,
  });
}

class MedicationEntity {
  final String patientId;
  final String medicineName;

  final DosageEntity dosage;

  final String frequency;
  final List<String> intakeTimes;

  final String startDate;
  final String endDate;

  final String indication;
  final String notes;

  final bool isActive;
  final String id;
  final String createdAt;
  final String updatedAt;

  final int version; // __v

  const MedicationEntity({
    required this.patientId,
    required this.medicineName,
    required this.dosage,
    required this.frequency,
    required this.intakeTimes,
    required this.startDate,
    required this.endDate,
    required this.indication,
    required this.notes,
    required this.isActive,
    required this.id,
    required this.createdAt,
    required this.updatedAt,
    required this.version,
  });
}

class DosageEntity {
  final int value;
  final String unit;

  const DosageEntity({
    required this.value,
    required this.unit,
  });
}