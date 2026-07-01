import 'package:injectable/injectable.dart';

import '../../data/models/check_interaction_request.dart';
import '../entities/drug_interaction_entity.dart';
import '../repository/axon_ai_repository.dart';

@injectable
class CheckInteractionUseCase {
  final AxonAiRepository repository;

  CheckInteractionUseCase(
    this.repository,
  );

  Future<DrugInteractionEntity> call(
    CheckInteractionRequest request,
  ) {
    return repository
        .checkInteraction(request);
  }
}