import 'package:Axon/features/patient/home_patient/domain/entities/pending_doses_response_entity.dart';

abstract class MedicationRepository {
  Future<PendingDosesResponseEntity> getPendingDoses();

  Future<void> markDoseAsTaken({
    required String medicationId,
    required String time,
  });
}