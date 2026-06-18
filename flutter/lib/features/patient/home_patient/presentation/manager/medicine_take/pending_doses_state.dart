import 'package:Axon/features/patient/home_patient/domain/entities/pending_doses_response_entity.dart';

abstract class PendingDosesState {}

class PendingDosesInitial extends PendingDosesState {}

class PendingDosesLoading extends PendingDosesState {}

class PendingDosesSuccess extends PendingDosesState {
  final PendingDosesResponseEntity response;

  PendingDosesSuccess(this.response);
}

class PendingDosesError extends PendingDosesState {
  final String message;

  PendingDosesError(this.message);
}