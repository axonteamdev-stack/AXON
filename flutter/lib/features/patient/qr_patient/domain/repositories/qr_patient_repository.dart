
import 'package:Axon/features/patient/qr_patient/domain/entities/patient_qr_entity.dart';

abstract class QrPatientRepository {
  Future<QrPatientEntity> getPatientById(String patientId);
}