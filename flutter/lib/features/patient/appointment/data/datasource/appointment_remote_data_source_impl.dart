import 'package:dio/dio.dart';
import 'package:Axon/features/patient/appointment/data/model/appointment_model.dart';
import 'package:Axon/features/patient/appointment/data/model/setup_intent_model.dart';
import 'package:injectable/injectable.dart';

import '../../../../../core/network/api_manager.dart';
import '../../../../../core/network/endpoints.dart';
import 'appointment_remote_data_source.dart';

@Injectable(as: AppointmentRemoteDataSource)
class AppointmentRemoteDataSourceImpl implements AppointmentRemoteDataSource {
  final ApiManager apiManager;

  AppointmentRemoteDataSourceImpl(this.apiManager);

  @override
  Future<AppointmentModel> createAppointment({
    required String doctorId,
    required String notes,
    required DateTime scheduledAt,
  }) async {
    try {
      final formattedDate =
          scheduledAt.toUtc().toIso8601String().split('.').first + 'Z';

      final body = {
        "doctorId": doctorId,
        "scheduledAt": formattedDate,
        "notes": notes,
      };

      print("CREATE APPOINTMENT BODY => $body");

      final response = await apiManager.dio.post(
        Endpoints.createAppointment,
        data: body,
      );

      print("CREATE APPOINTMENT RESPONSE => ${response.data}");

      return AppointmentModel.fromJson(response.data["data"]["appointment"]);
    } on DioException catch (e) {
      print("STATUS => ${e.response?.statusCode}");
      print("ERROR DATA => ${e.response?.data}");
      rethrow;
    }
  }

  @override
  Future<SetupIntentModel> createSetupIntent(String appointmentId) async {
    final response = await apiManager.dio.post(
      Endpoints.createSetupIntent,
      data: {"appointmentId": appointmentId},
    );

    print("SETUP INTENT RESPONSE => ${response.data}");

    return SetupIntentModel.fromJson(response.data["data"]);
  }
}
