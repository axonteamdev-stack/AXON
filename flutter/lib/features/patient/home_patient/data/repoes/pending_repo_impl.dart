import 'package:Axon/features/patient/home_patient/data/data_sources/pending_remote_data_source.dart';
import 'package:Axon/features/patient/home_patient/domain/entities/pending_doses_response_entity.dart';
import 'package:Axon/features/patient/home_patient/domain/repo/pending_repo.dart';
import 'package:injectable/injectable.dart';

@Injectable(as: MedicationRepository)
class MedicationRepositoryImpl implements MedicationRepository {
  final MedicationRemoteDataSource remoteDataSource;

  MedicationRepositoryImpl(this.remoteDataSource);

  @override
  Future<PendingDosesResponseEntity> getPendingDoses() async {
    return await remoteDataSource.getPendingDoses();
  }

  @override
  Future<void> markDoseAsTaken({
    required String medicationId,
    required String time,
  }) async {
    await remoteDataSource.markDoseAsTaken(
      medicationId: medicationId,
      time: time,
    );
  }
}