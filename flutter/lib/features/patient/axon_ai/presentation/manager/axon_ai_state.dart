import 'package:Axon/features/patient/axon_ai/domain/entities/drug_interaction_entity.dart';

abstract class AxonAiState {}

class AxonAiInitial extends AxonAiState {}

class AxonAiLoading extends AxonAiState {}

class AxonAiSuccess extends AxonAiState {
  final DrugInteractionEntity result;

  AxonAiSuccess(this.result);
}

class AxonAiError extends AxonAiState {
  final String message;

  AxonAiError(this.message);
}
