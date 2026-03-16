import 'package:Axon/features/patient/book_doctor/data/models/doctor_model.dart';

abstract class DoctorsState {}

class DoctorsInitial extends DoctorsState {}

class DoctorsLoaded extends DoctorsState {
  final List<DoctorModel> allDoctors;
  final List<DoctorModel> filteredDoctors;

  DoctorsLoaded({
    required this.allDoctors,
    required this.filteredDoctors,
  });
}
