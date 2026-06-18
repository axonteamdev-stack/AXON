import 'package:Axon/features/patient/qr_patient/domain/entities/patient_qr_entity.dart';


abstract class QrPatientState {}

class QrPatientInitial extends QrPatientState {}

class QrPatientLoading extends QrPatientState {}

class QrPatientSuccess extends QrPatientState {
  final QrPatientEntity patient;

  QrPatientSuccess(this.patient);
}

class QrPatientError extends QrPatientState {
  final String message;

  QrPatientError(this.message);
}