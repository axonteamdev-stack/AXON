import 'package:Axon/core/errors/error_handler.dart';

import 'package:Axon/core/errors/exceptions.dart';

import 'package:Axon/core/errors/failures.dart';

import 'package:Axon/core/errors/mappers/exception_to_failure_mapper.dart';

import 'package:Axon/core/network/api_manager.dart';

import 'package:Axon/core/network/endpoints.dart';

import 'package:Axon/features/doctor/Profile%20Doctor/data/datasources/doctor_profile_remote_datasource.dart';

import 'package:Axon/features/doctor/Profile%20Doctor/data/models/update_doctor_profile_model.dart';

import 'package:dartz/dartz.dart';

import 'package:dio/dio.dart';

import 'package:injectable/injectable.dart';

@Injectable(
  as: DoctorProfileRemoteDataSource,
)
class DoctorProfileRemoteDataSourceImpl
    implements
        DoctorProfileRemoteDataSource {

  final ApiManager apiManager;

  DoctorProfileRemoteDataSourceImpl({

    required this.apiManager,
  });

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

    try {

      print(
        "=========== UPDATE PROFILE REQUEST ===========",
      );

      FormData formData =
          FormData.fromMap({

        "phoneNumber":
            phoneNumber,

        "yearsExperience":
            yearsExperience,

        "about":
            about,

        "price":
            price,

        /// IMPORTANT
        /// API EXPECTS personalPhoto

        if (imagePath != null)
          "personalPhoto":
              await MultipartFile
                  .fromFile(

            imagePath,

            filename:
                imagePath
                    .split('/')
                    .last,
          ),
      });

      print("Fields:");

      for (var field
          in formData.fields) {

        print(
          "${field.key}: ${field.value}",
        );
      }

      print("Files:");

      for (var file
          in formData.files) {

        print(
          "${file.key}: ${file.value.filename}",
        );
      }

      final response =
          await apiManager.patch(

        Endpoints.updateProfile,

        formData,
      );

      print(
        "=========== UPDATE PROFILE RESPONSE ==========",
      );

      print(response);

      final profile =
          UpdateDoctorProfileModel
              .fromJson(response);

      return Right(profile);

    } on DioException catch (e) {

      return Left(

        mapExceptionToFailure(

          ErrorHandler.handle(e),
        ),
      );

    } on AppException catch (e) {

      return Left(

        mapExceptionToFailure(e),
      );

    } catch (e) {

      return Left(
        ServerFailure(),
      );
    }
  }
}