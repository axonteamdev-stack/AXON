import '../models/check_interaction_request.dart';
import '../models/drug_interaction_model.dart';

abstract class AxonAiRemoteDataSource {
  Future<DrugInteractionModel>
      checkInteraction(
    CheckInteractionRequest request,
  );
}