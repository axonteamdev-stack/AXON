import '../entities/drug_interaction_entity.dart';
import '../../data/models/check_interaction_request.dart';

abstract class AxonAiRepository {
  Future<DrugInteractionEntity>
      checkInteraction(
    CheckInteractionRequest request,
  );
}