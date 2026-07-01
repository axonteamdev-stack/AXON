import 'package:Axon/features/patient/appointment/domain/repository/appointment_repository.dart';
import 'package:injectable/injectable.dart';

import '../entities/setup_intent_entity.dart';

@injectable
class CreateSetupIntentUseCase {
  final AppointmentRepository repository;

  CreateSetupIntentUseCase(
    this.repository,
  );

  Future<SetupIntentEntity> call(
    String appointmentId,
  ) {
    return repository.createSetupIntent(
      appointmentId,
    );
  }
}