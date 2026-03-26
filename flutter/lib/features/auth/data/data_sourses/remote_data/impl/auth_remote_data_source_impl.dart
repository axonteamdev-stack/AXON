import 'dart:convert';
import 'dart:io';

import 'package:Axon/core/errors/error_handler.dart';
import 'package:Axon/core/errors/exceptions.dart';
import 'package:Axon/core/errors/failures.dart';
import 'package:Axon/core/errors/mappers/exception_to_failure_mapper.dart';
import 'package:Axon/core/network/api_manager.dart';
import 'package:Axon/core/network/endpoints.dart';
import 'package:Axon/core/network/network_info.dart';
import 'package:Axon/core/service/shared_pref/shared_pref.dart';
import 'package:Axon/core/service/shared_pref/pref_keys.dart';
import 'package:Axon/features/auth/data/data_sourses/remote_data/auth_remote_data_source.dart';
import 'package:Axon/features/auth/data/models/login_response_DM.dart';
import 'package:Axon/features/auth/data/models/register_response_doctor_Dm.dart';
import 'package:Axon/features/auth/data/models/register_response_patient_Dm.dart';
import 'package:dartz/dartz.dart';
import 'package:dio/dio.dart';
import 'package:injectable/injectable.dart';

@Injectable(as: AuthRemoteDataSource)
class AuthRemoteDataSourceImpl implements AuthRemoteDataSource {
  final NetworkInfo networkInfo;
  final ApiManager apiManager;

  AuthRemoteDataSourceImpl({
    required this.networkInfo,
    required this.apiManager,
  });

  // ================= HELPERS =================

  Future<void> addFile(FormData data, File? file, String key) async {
    if (file != null) {
      data.files.add(MapEntry(
        key,
        await MultipartFile.fromFile(
          file.path,
          filename: file.path.split('/').last,
        ),
      ));
    }
  }

  void addList(FormData data, List<String> list, String key) {
    for (var item in list) {
      data.fields.add(MapEntry(key, item));
    }
  }

  Future<void> addFilesWithDesc({
    required FormData data,
    required List<File> files,
    required List<String> descriptions,
    required String fileKey,
    required String descKey,
  }) async {
    for (int i = 0; i < files.length; i++) {
      data.files.add(MapEntry(
        fileKey,
        await MultipartFile.fromFile(files[i].path),
      ));

      if (i < descriptions.length) {
        data.fields.add(MapEntry(descKey, descriptions[i]));
      }
    }
  }

  // ================= SAVE USER =================

  Future<void> saveUserData(Map<String, dynamic> json) async {
    final pref = SharedPref();

    print("📦 [SAVE USER DATA FULL RESPONSE]: $json");

    await pref.setString(PrefKeys.accessToken, json["accessToken"] ?? "");
    await pref.setString(PrefKeys.refreshToken, json["refreshToken"] ?? "");
    await pref.setString(PrefKeys.userId, json["data"]?["id"]?.toString() ?? "");
    await pref.setString(PrefKeys.userRole, json["data"]?["role"] ?? "");

    /// 🔥 حفظ الريسبونس كامل
    await pref.setString(
      PrefKeys.fullLoginResponse,
      jsonEncode(json),
    );
  }

  // ================= LOGIN =================

  @override
  Future<Either<Failure, LoginResponseDM>> login({
    required String email,
    required String password,
  }) async {
    try {
      if (!await networkInfo.isConnected) {
        throw OfflineException();
      }

      final response = await apiManager.post(Endpoints.login, {
        "email": email,
        "password": password,
      });

      print("📥 [LOGIN RESPONSE]: $response");

      await saveUserData(response);

      final loginResponse = LoginResponseDM.fromJson(response);
      return Right(loginResponse);

    } on DioException catch (e) {
      print("❌ [LOGIN ERROR]: ${e.response?.data}");
      return Left(mapExceptionToFailure(ErrorHandler.handle(e)));

    } on AppException catch (e) {
      return Left(mapExceptionToFailure(e));

    } catch (e) {
      print("🔥 [LOGIN UNKNOWN ERROR]: $e");
      return Left(ServerFailure());
    }
  }

  // ================= REGISTER DOCTOR =================

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

      final data = FormData.fromMap({
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
      });

      await addFile(data, licenseImages, "licenseImage");
      await addFile(data, personalPhoto, "personalPhoto");

      final response = await apiManager.post(
        Endpoints.registerDoctor,
        data,
      );

      print("📥 [REGISTER DOCTOR RESPONSE]: $response");

      await saveUserData(response);

      final doctorResponse = RegisterResponseDoctorDm.fromJson(response);
      return Right(doctorResponse);

    } on DioException catch (e) {
      print("❌ [REGISTER DOCTOR ERROR]: ${e.response?.data}");
      return Left(mapExceptionToFailure(ErrorHandler.handle(e)));

    } on AppException catch (e) {
      return Left(mapExceptionToFailure(e));

    } catch (e) {
      print("🔥 [REGISTER DOCTOR UNKNOWN ERROR]: $e");
      return Left(ServerFailure());
    }
  }

  // ================= REGISTER PATIENT =================

  @override
  Future<Either<Failure, RegisterResponsePatientDm>> registerPatient({
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
    try {
      if (!await networkInfo.isConnected) {
        throw OfflineException();
      }

      final data = FormData.fromMap({
        "fullName": fullName,
        "email": email,
        "password": password,
        "phoneNumber": phoneNumber,
        "gender": gender,
        "bloodType": bloodType,
        "height": height,
        "weight": weight,
      });

      addList(data, conditions, "conditions");
      addList(data, allergies, "allergies");

      await addFile(data, personalPhoto, "personalPhoto");

      await addFilesWithDesc(
        data: data,
        files: radiologyImages,
        descriptions: radiologyDescriptions,
        fileKey: "radiologyImage",
        descKey: "radiologyDescription",
      );

      await addFilesWithDesc(
        data: data,
        files: labImages,
        descriptions: labDescriptions,
        fileKey: "labImage",
        descKey: "labDescription",
      );

      final response = await apiManager.post(
        Endpoints.registerPatient,
        data,
      );

      print("📥 [REGISTER PATIENT RESPONSE]: $response");

      await saveUserData(response);

      final result = RegisterResponsePatientDm.fromJson(response);
      return Right(result);

    } on DioException catch (e) {
      print("❌ [REGISTER PATIENT ERROR]: ${e.response?.data}");
      return Left(mapExceptionToFailure(ErrorHandler.handle(e)));

    } on AppException catch (e) {
      return Left(mapExceptionToFailure(e));

    } catch (e) {
      print("🔥 [REGISTER PATIENT UNKNOWN ERROR]: $e");
      return Left(ServerFailure());
    }
  }
}