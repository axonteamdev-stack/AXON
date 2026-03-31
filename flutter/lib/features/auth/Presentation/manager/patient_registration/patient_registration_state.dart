import 'package:Axon/core/errors/failures.dart';
import 'package:Axon/features/auth/domain/entities/medical_profile_entity.dart';
import 'package:Axon/features/auth/domain/entities/register_response_patient_entity.dart';

abstract class PatientRegistrationState {
  String? get bloodType => null;
}

class PatientRegistrationInitial extends PatientRegistrationState {}

class PatientRegistrationLoading extends PatientRegistrationState {}

class PatientRegistrationFormState extends PatientRegistrationState {

  final String? bloodType;
  final double? height;
  final double? weight;

  final List<String> conditions;
  final List<String> allergies;

  final List<RadiologyTestEntity> radiologyTests;
  final List<LabTestEntity> labTests;

  PatientRegistrationFormState({
    this.bloodType,
    this.height,
    this.weight,
    this.conditions = const [],
    this.allergies = const [],
    this.radiologyTests = const [],
    this.labTests = const [],
  });

  PatientRegistrationFormState copyWith({
    String? bloodType,
    double? height,
    double? weight,
    List<String>? conditions,
    List<String>? allergies,
    List<RadiologyTestEntity>? radiologyTests,
    List<LabTestEntity>? labTests,
  }) {
    return PatientRegistrationFormState(
      bloodType: bloodType ?? this.bloodType,
      height: height ?? this.height,
      weight: weight ?? this.weight,
      conditions: conditions ?? this.conditions,
      allergies: allergies ?? this.allergies,
      radiologyTests: radiologyTests ?? this.radiologyTests,
      labTests: labTests ?? this.labTests,
    );
  }
}

class PatientRegistrationSuccess extends PatientRegistrationState {
  final RegisterPatientEntity? registerPatientEntity;

  PatientRegistrationSuccess({this.registerPatientEntity});
}

class PatientRegistrationError extends PatientRegistrationState {
  final Failure failure;

  PatientRegistrationError({required this.failure});
}