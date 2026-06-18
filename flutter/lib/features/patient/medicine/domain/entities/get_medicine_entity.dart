class GetMedicineEntity {
  final bool success;
  final String message;
  final MedicineResponseDataEntity data;

  const GetMedicineEntity({
    required this.success,
    required this.message,
    required this.data,
  });
}

class MedicineResponseDataEntity {
  final List<MedicineDataEntity> medications;

  const MedicineResponseDataEntity({
    required this.medications,
  });
}

class MedicineDataEntity {
  final DosageEntity dosage;
  final String id;
  final String patientId;
  final String medicineName;
  final String frequency;
  final List<String> intakeTimes;
  final String startDate;
  final String endDate;
  final String? indication;
  final String? notes;
  final bool isActive;
  final String createdAt;
  final String updatedAt;
  final StatsEntity stats;
  final bool isExpired;

  const MedicineDataEntity({
    required this.dosage,
    required this.id,
    required this.patientId,
    required this.medicineName,
    required this.frequency,
    required this.intakeTimes,
    required this.startDate,
    required this.endDate,
    this.indication,
    this.notes,
    required this.isActive,
    required this.createdAt,
    required this.updatedAt,
    required this.stats,
    required this.isExpired,
  });
}

class DosageEntity {
  final num value;
  final String unit;

  const DosageEntity({
    required this.value,
    required this.unit,
  });
}

class StatsEntity {
  final int total;
  final int pending;
  final int taken;
  final int skipped;

  const StatsEntity({
    required this.total,
    required this.pending,
    required this.taken,
    required this.skipped,
  });
}