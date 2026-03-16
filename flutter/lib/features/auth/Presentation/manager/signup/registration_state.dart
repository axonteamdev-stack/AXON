part of 'registration_cubit.dart';

abstract class RegistrationState {}

class RegistrationInitial extends RegistrationState {}

class RegistrationLoading extends RegistrationState {}

class RegistrationSuccess extends RegistrationState {}

class RegistrationError extends RegistrationState {
  final String message;
  RegistrationError(this.message);
}

class GenderChanged extends RegistrationState {}
class ImagePicked extends RegistrationState {}
class TermsChanged extends RegistrationState {}
