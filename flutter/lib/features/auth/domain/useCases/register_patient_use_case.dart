import 'dart:io';

import 'package:Axon/core/errors/failures.dart';
import 'package:Axon/features/auth/domain/entities/register_response_patient_entity.dart';
import 'package:Axon/features/auth/domain/repo/auth_repo.dart';
import 'package:dartz/dartz.dart';

class RegisterPatientUseCase {
  final AuthRepo authRepo;

  RegisterPatientUseCase(this.authRepo);

  Future<Either<Failure,  RegisterPatientEntity>> invoke({
    required String fullName,
    required String email,
    required String password,
    required String phoneNumber,
    required String gender,
    required String bloodType,
    required int height,
    required int weight,
    required List<String> conditions,
    required List<String> allergies,
    required List<File> radiologyImages,
    required List<String> radiologyDescriptions,
    required List<File> labImages,
    required List<String> labDescriptions,
    File? personalPhoto,
  }) {
    return authRepo.registerPatient(
      fullName: fullName,
      email: email,
      password: password,
      phoneNumber: phoneNumber,
      gender: gender,
      bloodType: bloodType,
      height: height,
      weight: weight,
      conditions: conditions,
      allergies: allergies,
      radiologyImages: radiologyImages,
      radiologyDescriptions: radiologyDescriptions,
      labImages: labImages,
      labDescriptions: labDescriptions,
      personalPhoto: personalPhoto,
    );
  }
}