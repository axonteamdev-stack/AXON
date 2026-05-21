import 'package:Axon/core/errors/failures.dart';

import 'package:Axon/core/service/shared_pref/pref_keys.dart';

import 'package:Axon/core/service/shared_pref/shared_pref.dart';

import 'package:Axon/features/doctor/Profile%20Doctor/data/datasources/doctor_profile_remote_datasource.dart';

import 'package:Axon/features/doctor/Profile%20Doctor/data/models/update_doctor_profile_model.dart';

import 'package:Axon/features/doctor/Profile%20Doctor/domain/repo/doctor_profile_repo.dart';

import 'package:dartz/dartz.dart';

import 'package:injectable/injectable.dart';

@Injectable(
  as: DoctorProfileRepo,
)
class DoctorProfileRepoImpl
    implements DoctorProfileRepo {

  final DoctorProfileRemoteDataSource
      remoteDataSource;

  DoctorProfileRepoImpl(
    this.remoteDataSource,
  );

  @override
  Future<Either<
      Failure,
      UpdateDoctorProfileModel>>
  updateDoctorProfile({

    required String phoneNumber,

    required String yearsExperience,

    required String about,

    required String price,

    String? imagePath,

  }) async {

    final doctorId =
        await SharedPref().getString(
      PrefKeys.userId,
    );

    print(
      "=========== DOCTOR ID ===========",
    );

    print(doctorId);

    print(
      "=================================",
    );

    return remoteDataSource
        .updateDoctorProfile(

      phoneNumber: phoneNumber,

      yearsExperience:
          yearsExperience,

      about: about,

      price: price,

      imagePath: imagePath,
    );
  }
}