import 'dart:io';

import 'package:Axon/core/errors/failures.dart';
import 'package:Axon/features/auth/domain/entities/login_response_entity.dart';
import 'package:Axon/features/auth/domain/entities/register_response_doctor_entity.dart';
import 'package:Axon/features/auth/domain/entities/register_response_patient_entity.dart';
import 'package:dartz/dartz.dart';

abstract class AuthRepo {
  Future<Either<Failure, RegisterResponseDoctorEntity>>registerDoctor({
    required String fullName,
    required String email,
    required String password,
    required String phoneNumber,
    required String gender,
    required String specialization,
    required int yearsExperience,
    required String medicalLicenseNumber,
    required int price,
    required String about,
    required List<File> licenseImages,
    File? personalPhoto,
  });



   Future<Either<Failure,RegisterPatientEntity>> registerPatient({
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
  });


    Future<Either<Failure, LoginResponseEntity>> login({
    required String email,
    required String password,
  });
}
