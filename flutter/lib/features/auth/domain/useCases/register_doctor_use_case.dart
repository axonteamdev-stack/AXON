import 'dart:io';

import 'package:Axon/core/errors/failures.dart';
import 'package:Axon/features/auth/domain/entities/register_response_doctor_entity.dart';
import 'package:Axon/features/auth/domain/repo/auth_repo.dart';
import 'package:dartz/dartz.dart';

class RegisterDoctorUseCase {
  AuthRepo authRepo;
  RegisterDoctorUseCase({required this.authRepo});

  Future<Either<Failure, RegisterResponseDoctorEntity>> invoke({
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
  }) {
    return authRepo.registerDoctor(
      fullName: fullName,
      email: email,
      password: password,
      phoneNumber: phoneNumber,
      gender: gender,
      specialization: specialization,
      yearsExperience: yearsExperience,
      medicalLicenseNumber: medicalLicenseNumber,
      price: price,
      about: about,
      licenseImages: licenseImages,
      personalPhoto: personalPhoto,
    );
  }
}
