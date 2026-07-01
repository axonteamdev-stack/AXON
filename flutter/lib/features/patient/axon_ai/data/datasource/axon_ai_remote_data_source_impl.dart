import 'package:Axon/core/network/api_manager.dart';
import 'package:injectable/injectable.dart';

import '../models/check_interaction_request.dart';
import '../models/drug_interaction_model.dart';
import 'axon_ai_remote_data_source.dart';

@Injectable(as: AxonAiRemoteDataSource)
class AxonAiRemoteDataSourceImpl
    implements AxonAiRemoteDataSource {
  final ApiManager apiManager;

  AxonAiRemoteDataSourceImpl(
    this.apiManager,
  );

  @override
  Future<DrugInteractionModel>
      checkInteraction(
    CheckInteractionRequest request,
  ) async {
    final response =
        await apiManager.dio.post(
      '/ddi/check-direct',
      data: request.toJson(),
    );

    return DrugInteractionModel.fromJson(
      response.data,
    );
  }
}