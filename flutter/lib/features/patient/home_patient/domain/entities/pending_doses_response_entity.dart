class PendingDosesResponseEntity {
  final bool success;
  final String message;
  final PendingDosesDataEntity data;

  const PendingDosesResponseEntity({
    required this.success,
    required this.message,
    required this.data,
  });
}

class PendingDosesDataEntity {
  final List<DoseEntity> doses;

  const PendingDosesDataEntity({required this.doses});
}

class DoseEntity {
  final String id;
  final String patientId;
  final MedicationEntity medication;
  final String date;
  final String time;
  final String status;
  final DateTime createdAt;
  final DateTime updatedAt;

  const DoseEntity({
    required this.id,
    required this.patientId,
    required this.medication,
    required this.date,
    required this.time,
    required this.status,
    required this.createdAt,
    required this.updatedAt,
  });
}

class MedicationEntity {
  final String id;
  final String medicineName;
  final DosageEntity dosage;

  const MedicationEntity({
    required this.id,
    required this.medicineName,
    required this.dosage,
  });
}

class DosageEntity {
  final double value;
  final String unit;

  const DosageEntity({required this.value, required this.unit});
}
