import 'package:Axon/core/errors/failures.dart';
import 'package:Axon/features/auth/domain/entities/register_response_doctor_entity.dart';

abstract class DoctorRegistrationState {}

class InitialDoctorRegistration extends DoctorRegistrationState {
}

class DoctorRegistrationLoading extends DoctorRegistrationState {}

class DoctorRegistrationSuccess extends DoctorRegistrationState {
  final RegisterResponseDoctorEntity? registerDoctorEntity;
  DoctorRegistrationSuccess({this.registerDoctorEntity});
}

class DoctorRegistrationError extends DoctorRegistrationState {
  final Failure failure;
  DoctorRegistrationError({required this.failure});
}


class LicenseDoctorImage extends DoctorRegistrationState{}
class SpecializationDoctor extends DoctorRegistrationState{}
