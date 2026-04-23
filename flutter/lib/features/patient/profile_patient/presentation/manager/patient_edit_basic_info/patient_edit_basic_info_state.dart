import 'package:Axon/core/errors/failures.dart';

abstract class PatientEditBasicInfoState {}

class PatientEditBasicInfoInitial extends PatientEditBasicInfoState {}

class PatientEditBasicInfoLoading extends PatientEditBasicInfoState {}

class PatientEditBasicInfoSuccess extends PatientEditBasicInfoState {}

class PatientEditBasicInfoError extends PatientEditBasicInfoState {
  final Failure failure;

  PatientEditBasicInfoError({required this.failure});
}