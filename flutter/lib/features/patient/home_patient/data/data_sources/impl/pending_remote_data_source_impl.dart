import 'package:Axon/core/network/api_manager.dart';
import 'package:Axon/core/network/endpoints.dart';
import 'package:Axon/features/patient/home_patient/data/data_sources/pending_remote_data_source.dart';
import 'package:Axon/features/patient/home_patient/data/models/pending_doses_response_model.dart';
import 'package:injectable/injectable.dart';

@Injectable(as: MedicationRemoteDataSource)
class MedicationRemoteDataSourceImpl implements MedicationRemoteDataSource {
  final ApiManager apiManager;

  MedicationRemoteDataSourceImpl(this.apiManager);

  @override
  Future<PendingDosesResponseModel> getPendingDoses() async {
    final response = await apiManager.get(Endpoints.getMedicineDose);
    print(response.runtimeType);
    print(response);
    return PendingDosesResponseModel.fromJson(response);
  }

  @override
  Future<void> markDoseAsTaken({
    required String medicationId,
    required String time,
  }) async {
    await apiManager.post(Endpoints.markDoseAsTaken(medicationId), {
      "time": time,
      "status": "taken",
    });
  }
}
