import 'package:Axon/features/patient/home_patient/domain/entities/pending_doses_response_entity.dart';
import 'package:Axon/features/patient/home_patient/domain/repo/pending_repo.dart';
import 'package:injectable/injectable.dart';

@injectable
class GetPendingDosesUseCase {
  final MedicationRepository repository;

  GetPendingDosesUseCase(this.repository);

  Future<PendingDosesResponseEntity> call() {
    return repository.getPendingDoses();
  }
}