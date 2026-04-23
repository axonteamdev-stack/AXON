import 'dart:io';
import 'package:Axon/core/errors/failures.dart';
import 'package:Axon/features/auth/domain/entities/register_response_patient_entity.dart';
import 'package:Axon/features/patient/profile_patient/domain/repo/profile_patient_repo.dart';
import 'package:dartz/dartz.dart';
import 'package:injectable/injectable.dart';

@injectable
class UpdateProfilePatientUseCase {
  final ProfilePatientRepo profilePatientRepo;

  UpdateProfilePatientUseCase(this.profilePatientRepo);

  Future<Either<Failure, RegisterPatientEntity>> call({
    required String fullName,
    required String email,
    required String phoneNumber,
    required String gender,
    required String bloodType,
    required double height,
    required double weight,
    required List<String> conditions,
    required List<String> allergies,
    File? personalPhoto,
    List<File>? radiologyImages,
    List<String>? radiologyDescriptions,
    List<File>? labImages,
    List<String>? labDescriptions,
  }) {
    return profilePatientRepo.updatePatient(
      fullName: fullName,
      email: email,
      phoneNumber: phoneNumber,
      gender: gender,
      bloodType: bloodType,
      height: height,
      weight: weight,
      conditions: conditions,
      allergies: allergies,
      personalPhoto: personalPhoto,
      radiologyImages: radiologyImages,
      radiologyDescriptions: radiologyDescriptions,
      labImages: labImages,
      labDescriptions: labDescriptions,
    );
  }
}