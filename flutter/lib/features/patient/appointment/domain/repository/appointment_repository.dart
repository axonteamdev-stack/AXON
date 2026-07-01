import 'package:Axon/features/patient/appointment/domain/entities/appointment_entity.dart';
import 'package:Axon/features/patient/appointment/domain/entities/setup_intent_entity.dart';

abstract class AppointmentRepository {
  Future<AppointmentEntity> createAppointment({
    required String doctorId,
    required String notes,
    required DateTime scheduledAt,
  });

  Future<SetupIntentEntity> createSetupIntent(
    String appointmentId,
  );
}