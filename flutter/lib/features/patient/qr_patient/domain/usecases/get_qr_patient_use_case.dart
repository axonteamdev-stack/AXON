import 'package:Axon/features/patient/qr_patient/domain/entities/patient_qr_entity.dart';
import 'package:injectable/injectable.dart';
import '../repositories/qr_patient_repository.dart';

@injectable
class GetQrPatientUseCase {
  final QrPatientRepository repository;

  GetQrPatientUseCase(this.repository);

  Future<QrPatientEntity> call(String patientId) {
    return repository.getPatientById(patientId);
  }
}