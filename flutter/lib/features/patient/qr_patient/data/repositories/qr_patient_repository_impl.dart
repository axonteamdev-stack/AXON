import 'package:Axon/features/patient/qr_patient/domain/entities/patient_qr_entity.dart';
import 'package:injectable/injectable.dart';

import '../../domain/repositories/qr_patient_repository.dart';
import '../data_sources/qr_patient_remote_data_source.dart';

@Injectable(as: QrPatientRepository)
class QrPatientRepositoryImpl
    implements QrPatientRepository {
  final QrPatientRemoteDataSource remoteDataSource;

  QrPatientRepositoryImpl(this.remoteDataSource);

  @override
  Future<QrPatientEntity> getPatientById(
    String patientId,
  ) {
    return remoteDataSource.getPatientById(patientId);
  }
}