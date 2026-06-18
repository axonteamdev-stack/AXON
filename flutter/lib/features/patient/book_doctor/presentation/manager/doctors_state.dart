import 'package:Axon/core/errors/failures.dart';
import 'package:Axon/features/patient/book_doctor/domain/entities/doctor_entity.dart';

abstract class DoctorsState {}

class DoctorsInitial extends DoctorsState {}

class DoctorsLoading extends DoctorsState {}

class DoctorsSuccess extends DoctorsState {
  final List<DoctorEntity> allDoctors;
  final List<DoctorEntity> filteredDoctors;

  DoctorsSuccess({
    required this.allDoctors,
    required this.filteredDoctors,
  });
}

class DoctorsError extends DoctorsState {
  final Failure failure;

  DoctorsError({
    required this.failure,
  });
}