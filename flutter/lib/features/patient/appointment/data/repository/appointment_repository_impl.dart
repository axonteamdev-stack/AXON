import 'package:Axon/features/patient/appointment/data/datasource/appointment_remote_data_source.dart';
import 'package:Axon/features/patient/appointment/domain/repository/appointment_repository.dart';
import 'package:injectable/injectable.dart';

import '../../domain/entities/appointment_entity.dart';
import '../../domain/entities/setup_intent_entity.dart';

@Injectable(as: AppointmentRepository)
class AppointmentRepositoryImpl
    implements AppointmentRepository {
  final AppointmentRemoteDataSource remote;

  AppointmentRepositoryImpl(this.remote);

  @override
  Future<AppointmentEntity> createAppointment({
    required String doctorId,
    required String notes,
    required DateTime scheduledAt,
  }) {
    return remote.createAppointment(
      doctorId: doctorId,
      notes: notes,
      scheduledAt: scheduledAt,
    );
  }

  @override
  Future<SetupIntentEntity> createSetupIntent(
    String appointmentId,
  ) {
    return remote.createSetupIntent(
      appointmentId,
    );
  }
}