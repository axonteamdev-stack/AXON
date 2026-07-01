import 'package:Axon/features/patient/appointment/domain/repository/appointment_repository.dart';
import 'package:injectable/injectable.dart';

import '../entities/appointment_entity.dart';

@injectable
class CreateAppointmentUseCase {
  final AppointmentRepository
      repository;

  CreateAppointmentUseCase(
    this.repository,
  );

  Future<AppointmentEntity> call({
    required String doctorId,
    required String notes,
    required DateTime scheduledAt,
  }) {
    return repository.createAppointment(
      doctorId: doctorId,
      notes: notes,
      scheduledAt: scheduledAt,
    );
  }
}