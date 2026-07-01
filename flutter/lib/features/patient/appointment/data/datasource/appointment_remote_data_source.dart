import 'package:Axon/features/patient/appointment/data/model/appointment_model.dart';
import 'package:Axon/features/patient/appointment/data/model/setup_intent_model.dart';

abstract class AppointmentRemoteDataSource {
  Future<AppointmentModel> createAppointment({
    required String doctorId,
    required String notes,
    required DateTime scheduledAt,
  });

  Future<SetupIntentModel> createSetupIntent(
    String appointmentId,
  );
}