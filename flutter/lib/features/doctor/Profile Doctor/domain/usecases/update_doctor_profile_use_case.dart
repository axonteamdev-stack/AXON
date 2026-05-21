import 'package:Axon/core/errors/failures.dart';

import 'package:Axon/features/doctor/Profile%20Doctor/data/models/update_doctor_profile_model.dart';

import 'package:Axon/features/doctor/Profile%20Doctor/domain/repo/doctor_profile_repo.dart';

import 'package:dartz/dartz.dart';

import 'package:injectable/injectable.dart';

@injectable
class UpdateDoctorProfileUseCase {

  final DoctorProfileRepo repository;

  UpdateDoctorProfileUseCase(
    this.repository,
  );

  Future<Either<
      Failure,
      UpdateDoctorProfileModel>>
  call({

    required String phoneNumber,

    required String yearsExperience,

    required String about,

    required String price,

    required String specialization,

    String? imagePath,
  }) {

    return repository
        .updateDoctorProfile(

      phoneNumber: phoneNumber,

      yearsExperience:
          yearsExperience,

      about: about,

      price: price,

      specialization:
          specialization,

      imagePath: imagePath,
    );
  }
}