abstract class AppointmentState {}

class AppointmentInitial
    extends AppointmentState {}

class AppointmentLoading
    extends AppointmentState {}

class AppointmentSuccess
    extends AppointmentState {}

class AppointmentError
    extends AppointmentState {
  final String message;

  AppointmentError(
    this.message,
  );
}