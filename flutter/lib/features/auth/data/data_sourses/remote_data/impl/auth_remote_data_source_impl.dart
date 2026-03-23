import 'dart:io';

import 'package:Axon/core/errors/error_handler.dart';
import 'package:Axon/core/errors/exceptions.dart';
import 'package:Axon/core/errors/failures.dart';
import 'package:Axon/core/errors/mappers/exception_to_failure_mapper.dart';
import 'package:Axon/core/network/api_manager.dart';
import 'package:Axon/core/network/endpoints.dart';
import 'package:Axon/core/network/network_info.dart';
import 'package:Axon/features/auth/data/data_sourses/remote_data/auth_remote_data_source.dart';
import 'package:Axon/features/auth/data/models/login_response_DM.dart';
import 'package:Axon/features/auth/data/models/register_response_doctor_Dm.dart';
import 'package:Axon/features/auth/data/models/register_response_patient_Dm.dart';
import 'package:dartz/dartz.dart';
import 'package:dio/dio.dart';

class AuthRemoteDataSourceImpl implements AuthRemoteDataSource {
  final NetworkInfo networkInfo;
  final ApiManager apiManager;

  AuthRemoteDataSourceImpl({
    required this.networkInfo,
    required this.apiManager,
  });

  // ================= LOGIN =================

  @override
  Future<Either<Failure, LoginResponseDM>> login({
    required String email,
    required String password,
  }) async {
    try {
      // todo: check internet
      if (!await networkInfo.isConnected) {
        throw OfflineException();
      }

      // todo: call API
      final response = await apiManager.post(Endpoints.login, {
        "email": email,
        "password": password,
      });

      // todo: parse
      final loginResponse = LoginResponseDM.fromJson(response);

      return Right(loginResponse);
    } on DioException catch (e) {
      throw ErrorHandler.handle(e);
    } on AppException catch (e) {
      // todo exception → failure
      return Left(mapExceptionToFailure(e));
    } catch (e) {
      return Left(ServerFailure());
    }
  }

  @override
  Future<Either<Failure, RegisterResponseDoctorDm>> registerDoctor({
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
    try {
      if (!await networkInfo.isConnected) {
        throw OfflineException();
      }

      final doctorData = FormData.fromMap({
        "email": email,
        "password": password,
        "phoneNumber": phoneNumber,
        "gender": gender,
        "specialization": specialization,
        "yearsExperience": yearsExperience,
        "medicalLicenseNumber": medicalLicenseNumber,
        "fullName": fullName,
        "about": about,
        "price": price,

        //todo: license image (single file)
        "licenseImage": await MultipartFile.fromFile(
          licenseImages.path,
          filename: licenseImages.path.split('/').last,
        ),

        //todo: personal photo (optional)
        if (personalPhoto != null)
          "personalPhoto": await MultipartFile.fromFile(
            personalPhoto.path,
            filename: personalPhoto.path.split('/').last,
          ),
      });

      var response = await apiManager.post(
        Endpoints.registerDoctor,
        doctorData,
      );
      var doctorResponse = RegisterResponseDoctorDm.fromJson(response);
      return Right(doctorResponse);
    } on DioException catch (e) {
      throw ErrorHandler.handle(e);
    } on AppException catch (e) {
      // todo exception → failure
      return Left(mapExceptionToFailure(e));
    } catch (e) {
      return Left(ServerFailure());
    }
  }

  @override
  Future<Either<Failure, RegisterResponsePatientDm>> registerPatient({
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
  }) async {
    try {
      // todo: check internet
      if (!await networkInfo.isConnected) {
        throw OfflineException();
      }

      final patientData = FormData();

      // ================= BASIC DATA =================
      patientData.fields.addAll([
        MapEntry("fullName", fullName),
        MapEntry("email", email),
        MapEntry("password", password),
        MapEntry("phoneNumber", phoneNumber),
        MapEntry("gender", gender),
        MapEntry("bloodType", bloodType),
        MapEntry("height", height.toString()),
        MapEntry("weight", weight.toString()),
      ]);

      // ================= LISTS =================

      // 🔥 conditions
      for (var condition in conditions) {
        patientData.fields.add(MapEntry("conditions", condition));
      }

      // 🔥 allergies
      for (var allergy in allergies) {
        patientData.fields.add(MapEntry("allergies", allergy));
      }

      // ================= PERSONAL PHOTO =================
      if (personalPhoto != null) {
        patientData.files.add(
          MapEntry(
            "personalPhoto",
            await MultipartFile.fromFile(
              personalPhoto.path,
              filename: personalPhoto.path.split('/').last,
            ),
          ),
        );
      }

      // ================= RADIOLOGY =================
      for (int i = 0; i < radiologyImages.length; i++) {
        patientData.files.add(
          MapEntry(
            "radiologyImage",
            await MultipartFile.fromFile(
              radiologyImages[i].path,
              filename: radiologyImages[i].path.split('/').last,
            ),
          ),
        );

        // description بنفس الترتيب
        if (i < radiologyDescriptions.length) {
          patientData.fields.add(
            MapEntry("radiologyDescription", radiologyDescriptions[i]),
          );
        }
      }

      // ================= LAB =================
      for (int i = 0; i < labImages.length; i++) {
        patientData.files.add(
          MapEntry(
            "labImage",
            await MultipartFile.fromFile(
              labImages[i].path,
              filename: labImages[i].path.split('/').last,
            ),
          ),
        );

        if (i < labDescriptions.length) {
          patientData.fields.add(MapEntry("labDescription", labDescriptions[i]));
        }
      }

      // ================= REQUEST =================
      final response = await apiManager.post(
        Endpoints.registerPatient,
        patientData,
      );

      final result = RegisterResponsePatientDm.fromJson(response);

      return Right(result);
    } on DioException catch (e) {
      throw ErrorHandler.handle(e);
    } on AppException catch (e) {
      return Left(mapExceptionToFailure(e));
    } catch (e) {
      return Left(ServerFailure());
    }
  }
}
