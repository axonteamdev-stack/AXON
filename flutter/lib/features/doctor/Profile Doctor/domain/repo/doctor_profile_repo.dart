import 'package:Axon/core/errors/failures.dart';

import 'package:dartz/dartz.dart';

import '../../data/models/update_doctor_profile_model.dart';

abstract class DoctorProfileRepo {

  Future<Either<
      Failure,
      UpdateDoctorProfileModel>>
  updateDoctorProfile({

    required String phoneNumber,

    required String yearsExperience,

    required String about,

    required String price,

    String? imagePath,
  });
}