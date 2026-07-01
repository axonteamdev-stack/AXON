import 'package:injectable/injectable.dart';

import '../../domain/entities/drug_interaction_entity.dart';
import '../../domain/repository/axon_ai_repository.dart';
import '../datasource/axon_ai_remote_data_source.dart';
import '../models/check_interaction_request.dart';

@Injectable(as: AxonAiRepository)
class AxonAiRepositoryImpl
    implements AxonAiRepository {
  final AxonAiRemoteDataSource remote;

  AxonAiRepositoryImpl(
    this.remote,
  );

  @override
  Future<DrugInteractionEntity>
      checkInteraction(
    CheckInteractionRequest request,
  ) {
    return remote.checkInteraction(
      request,
    );
  }
}