import 'package:Axon/core/errors/failures.dart';
import 'package:Axon/features/auth/domain/entities/register_response_doctor_entity.dart';
import 'package:Axon/features/auth/domain/repo/auth_repo.dart';
import 'package:dartz/dartz.dart';

class RegisterDoctorUseCase {
  AuthRepo authRepo;
  RegisterDoctorUseCase({required this.authRepo});

  Future<Either<Failure, RegisterResponseDoctorEntity>> invoke(
    String? image,
    String fullName,
    String email,
    String phone,
    String gender,
    String password,
    String specialization,
    String price,
    String experience,
    String about,
    String licenesNumber,
    String medicalLicene,
  ) {
    return authRepo.registerDoctor(
      image,
      fullName,
      email,
      phone,
      gender,
      password,
      specialization,
      price,
      experience,
      about,
      licenesNumber,
      medicalLicene,
    );
  }
}
