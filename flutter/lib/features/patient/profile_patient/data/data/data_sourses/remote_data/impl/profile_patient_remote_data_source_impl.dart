import 'dart:io';

import 'package:Axon/core/errors/error_handler.dart';
import 'package:Axon/core/errors/exceptions.dart';
import 'package:Axon/core/errors/failures.dart';
import 'package:Axon/core/errors/mappers/exception_to_failure_mapper.dart';
import 'package:Axon/core/network/api_manager.dart';
import 'package:Axon/core/network/endpoints.dart';
import 'package:Axon/core/network/network_info.dart';
import 'package:Axon/features/auth/data/models/register_response_patient_Dm.dart';
import 'package:Axon/features/auth/domain/entities/register_response_patient_entity.dart';
import 'package:Axon/features/patient/profile_patient/data/data/data_sourses/remote_data/profile_patient_remote_data_source.dart';
import 'package:dartz/dartz.dart';
import 'package:dio/dio.dart';
import 'package:injectable/injectable.dart';

@Injectable(as: ProfilePatientRemoteDataSource)
class ProfilePatientRemoteDataSourceImpl
    implements ProfilePatientRemoteDataSource {
  final NetworkInfo networkInfo;
  final ApiManager apiManager;

  ProfilePatientRemoteDataSourceImpl({
    required this.networkInfo,
    required this.apiManager,
  });

  /// =========================================
  /// Add Single File
  /// =========================================
  Future<void> addFile(
    FormData data,
    File? file,
    String key,
  ) async {
    if (file != null) {
      print("========== IMAGE FILE ==========");
      print("File Exists: ${file.existsSync()}");
      print("File Path: ${file.path}");
      print("File Name: ${file.path.split('/').last}");
      print("================================");

      data.files.add(
        MapEntry(
          key,
          await MultipartFile.fromFile(
            file.path,
            filename: file.path.split('/').last,
          ),
        ),
      );

      print("✅ Image Added To FormData");
    } else {
      print("❌ personalPhoto == NULL");
    }
  }

  /// =========================================
  /// Add Multiple Files + Description
  /// =========================================
  Future<void> addFilesWithDesc({
    required FormData data,
    required List<File> files,
    required List<String> descriptions,
    required String fileKey,
    required String descKey,
  }) async {
    for (int i = 0; i < files.length; i++) {
      data.files.add(
        MapEntry(
          fileKey,
          await MultipartFile.fromFile(
            files[i].path,
            filename: files[i].path.split('/').last,
          ),
        ),
      );

      if (i < descriptions.length) {
        data.fields.add(
          MapEntry(
            descKey,
            descriptions[i],
          ),
        );
      }
    }
  }

  /// =========================================
  /// Update Patient Profile
  /// =========================================
  @override
  Future<Either<Failure, RegisterPatientEntity>>
      updatePatient({
    required String fullName,
    required String email,
    required String phoneNumber,
    required String gender,
    required String bloodType,
    required double height,
    required double weight,
    required List<String> conditions,
    required List<String> allergies,
    File? personalPhoto,
    List<File>? radiologyImages,
    List<String>? radiologyDescriptions,
    List<File>? labImages,
    List<String>? labDescriptions,
  }) async {
    try {
      if (!await networkInfo.isConnected) {
        throw OfflineException();
      }

      print("========== BEFORE API ==========");
      print("fullName: $fullName");
      print("email: $email");
      print("phoneNumber: $phoneNumber");
      print("gender: $gender");
      print("bloodType: $bloodType");
      print("height: $height");
      print("weight: $weight");
      print("conditions: $conditions");
      print("allergies: $allergies");

      if (personalPhoto != null) {
        print("IMAGE EXISTS ✅");
        print("Image Path: ${personalPhoto.path}");
        print(
          "Image Name: ${personalPhoto.path.split('/').last}",
        );
      } else {
        print("❌ IMAGE IS NULL");
      }

      print("================================");

      /// =========================================
      /// IMPORTANT FIX
      /// conditions + allergies as JSON Array
      /// =========================================
      final data = FormData.fromMap({
        "fullName": fullName,
        "email": email,
        "phoneNumber": phoneNumber,
        "gender": gender,
        "bloodType": bloodType,
        "height": height,
        "weight": weight,

        /// الحل النهائي هنا
        "conditions": conditions,
        "allergies": allergies,
      });

      print("FINAL CONDITIONS => $conditions");
      print("FINAL ALLERGIES => $allergies");

      /// =========================================
      /// Personal Photo
      /// =========================================
      await addFile(
        data,
        personalPhoto,
        "personalPhoto",
      );

      /// =========================================
      /// Radiology
      /// =========================================
      if (radiologyImages != null &&
          radiologyDescriptions != null) {
        await addFilesWithDesc(
          data: data,
          files: radiologyImages,
          descriptions: radiologyDescriptions,
          fileKey: "radiologyImage",
          descKey: "radiologyDescription",
        );
      }

      /// =========================================
      /// Lab Tests
      /// =========================================
      if (labImages != null &&
          labDescriptions != null) {
        await addFilesWithDesc(
          data: data,
          files: labImages,
          descriptions: labDescriptions,
          fileKey: "labImage",
          descKey: "labDescription",
        );
      }

      print("🚀 PATCH REQUEST STARTED");

      print("========== FORM DATA ==========");
      for (var field in data.fields) {
        print("${field.key} => ${field.value}");
      }

      for (var file in data.files) {
        print("${file.key} => ${file.value.filename}");
      }
      print("================================");

      final response = await apiManager.patch(
        Endpoints.updateMe,
        data,
      );

      print("✅ PATCH SUCCESS");
      print("Response: $response");

      final result =
          RegisterResponsePatientDm.fromJson(
        response,
      );

      return Right(result);
    } on DioException catch (e) {
      print("❌ DIO ERROR");
      print("Message: ${e.message}");
      print("Response: ${e.response?.data}");
      print("Status Code: ${e.response?.statusCode}");

      return Left(
        mapExceptionToFailure(
          ErrorHandler.handle(e),
        ),
      );
    } on AppException catch (e) {
      print("❌ APP EXCEPTION");
      print(e.toString());

      return Left(
        mapExceptionToFailure(e),
      );
    } catch (e) {
      print("❌ UNKNOWN ERROR");
      print(e.toString());

      return Left(
        ServerFailure(),
      );
    }
  }
}