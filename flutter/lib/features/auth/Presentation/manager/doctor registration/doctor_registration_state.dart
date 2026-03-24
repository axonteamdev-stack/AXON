import 'package:image_picker/image_picker.dart';

abstract class DoctorRegistrationState {}

class DoctorRegistrationInitial extends DoctorRegistrationState {
  final String? selectedSpecialization;
  final XFile? personalFile;
  final XFile? licenseFile;

  DoctorRegistrationInitial({
    this.selectedSpecialization,
    this.licenseFile, this.personalFile,
  });
}

class DoctorRegistrationLoading extends DoctorRegistrationState {}

class DoctorRegistrationSuccess extends DoctorRegistrationState {
  final dynamic registerDoctorEntity;
  DoctorRegistrationSuccess({this.registerDoctorEntity});
}

class DoctorRegistrationError extends DoctorRegistrationState {
  final dynamic failure;
  DoctorRegistrationError({required this.failure});
}

class DoctorRegistrationErrorMessage extends DoctorRegistrationState {
  final String message;
  DoctorRegistrationErrorMessage(this.message);
}