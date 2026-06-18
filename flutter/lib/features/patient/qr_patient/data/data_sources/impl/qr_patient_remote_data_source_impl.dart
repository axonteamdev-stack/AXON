import 'package:Axon/features/patient/qr_patient/data/data_sources/qr_patient_remote_data_source.dart';
import 'package:Axon/features/patient/qr_patient/data/models/patient_qr_model.dart';
import 'package:injectable/injectable.dart';
import 'package:Axon/core/network/api_manager.dart';
import 'package:Axon/core/network/endpoints.dart';



@Injectable(as: QrPatientRemoteDataSource)
class QrPatientRemoteDataSourceImpl
    implements QrPatientRemoteDataSource {
  final ApiManager apiManager;

  QrPatientRemoteDataSourceImpl(this.apiManager);

  @override
  Future<QrPatientModel> getPatientById(String patientId) async {
    final response = await apiManager.get(
      "${Endpoints.getPatientById}/$patientId",
    );

    return QrPatientModel.fromJson(response);
  }
}