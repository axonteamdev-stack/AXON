import 'dart:io';

import 'package:Axon/core/errors/failures.dart';
import 'package:Axon/features/auth/data/data_sourses/remote_data/auth_remote_data_source.dart';
import 'package:Axon/features/auth/domain/entities/login_response_entity.dart';
import 'package:Axon/features/auth/domain/entities/register_response_doctor_entity.dart';
import 'package:Axon/features/auth/domain/entities/register_response_patient_entity.dart';
import 'package:Axon/features/auth/domain/repo/auth_repo.dart';
import 'package:dartz/dartz.dart';
import 'package:injectable/injectable.dart';

@Injectable(as: AuthRepo)
class AuthRepoImpl implements AuthRepo {
  final AuthRemoteDataSource authRemoteDataSource;

  AuthRepoImpl({required this.authRemoteDataSource});
  @override
  Future<Either<Failure, LoginResponseEntity>> login({
    required String email,
    required String password,
  }) async {
    var either = await authRemoteDataSource.login(
      email: email,
      password: password,
    );
    return either.fold((error) => Left(error), (response) => Right(response));
  }

  @override
  Future<Either<Failure, RegisterResponseDoctorEntity>> registerDoctor({
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
    required File licenseImages,
    File? personalPhoto,
  }) async {
    var either = await authRemoteDataSource.registerDoctor(
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
    return either.fold((error) => Left(error), (response) => Right(response));
  }

  @override
  Future<Either<Failure, RegisterPatientEntity>> registerPatient({
    required String fullName,
    required String email,
    required String password,
    required String phoneNumber,
    required String gender,
    required String bloodType,
    required double height,
    required double weight,
    required List<String> conditions,
    required List<String> allergies,
    required List<File> radiologyImages,
    required List<String> radiologyDescriptions,
    required List<File> labImages,
    required List<String> labDescriptions,
    File? personalPhoto,
  }) async {
    var either = await authRemoteDataSource.registerPatient(
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
    );
    return either.fold((error) => Left(error), (response) => Right(response));
  }
}
