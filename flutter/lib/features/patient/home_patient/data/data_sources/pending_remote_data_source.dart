import 'package:Axon/features/patient/home_patient/data/models/pending_doses_response_model.dart';

abstract class MedicationRemoteDataSource {
  Future<PendingDosesResponseModel> getPendingDoses();

  Future<void> markDoseAsTaken({
    required String medicationId,
    required String time,
  });
}
