import 'package:Axon/core/errors/failures.dart';
import 'package:Axon/features/auth/domain/entities/register_response_doctor_entity.dart';
import 'package:dartz/dartz.dart';

abstract class AuthRepo {
  Future<Either<Failure, RegisterResponseDoctorEntity>> registerDoctor(
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
  );
}
