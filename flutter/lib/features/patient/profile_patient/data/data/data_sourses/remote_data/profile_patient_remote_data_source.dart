import 'dart:io';
import 'package:Axon/core/errors/failures.dart';
import 'package:Axon/features/auth/domain/entities/register_response_patient_entity.dart';
import 'package:dartz/dartz.dart';

abstract class ProfilePatientRemoteDataSource {
  Future<Either<Failure, RegisterPatientEntity>> updatePatient({
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
  });
}