import 'package:Axon/features/patient/home_patient/domain/repo/pending_repo.dart';
import 'package:injectable/injectable.dart';

@injectable
class MarkDoseAsTakenUseCase {
  final MedicationRepository repository;

  MarkDoseAsTakenUseCase(this.repository);

  Future<void> call({
    required String medicationId,
    required String time,
  }) {
    return repository.markDoseAsTaken(
      medicationId: medicationId,
      time: time,
    );
  }
}