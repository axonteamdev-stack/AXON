import 'package:Axon/features/patient/qr_patient/data/models/patient_qr_model.dart';

abstract class QrPatientRemoteDataSource {
  Future<QrPatientModel> getPatientById(String patientId);
}