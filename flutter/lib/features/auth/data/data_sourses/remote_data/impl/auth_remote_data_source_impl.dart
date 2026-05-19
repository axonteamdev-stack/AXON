import 'dart:io';
import 'dart:convert';

import 'package:Axon/core/errors/error_handler.dart';
import 'package:Axon/core/errors/exceptions.dart';
import 'package:Axon/core/errors/failures.dart';
import 'package:Axon/core/errors/mappers/exception_to_failure_mapper.dart';
import 'package:Axon/core/network/api_manager.dart';
import 'package:Axon/core/network/endpoints.dart';
import 'package:Axon/core/network/network_info.dart';
import 'package:Axon/core/service/shared_pref/pref_keys.dart';
import 'package:Axon/core/service/shared_pref/shared_pref.dart';
import 'package:Axon/features/auth/data/data_sourses/remote_data/auth_remote_data_source.dart';
import 'package:Axon/features/auth/data/models/forgot_password_DM.dart';
import 'package:Axon/features/auth/data/models/login_response_DM.dart';
import 'package:Axon/features/auth/data/models/register_response_doctor_Dm.dart';
import 'package:Axon/features/auth/data/models/register_response_patient_Dm.dart';
import 'package:Axon/features/auth/domain/entities/forgot_password_entity.dart';
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

  // todo : reuse function

 Future<void> addFile(
  FormData data,
  File? file,
  String key,
) async {

  if (file == null) {
    return;
  }

  /// avoid server uploaded path
  if (file.path.startsWith("/uploads")) {

    print("⚠️ Skip uploaded server file: ${file.path}");

    return;
  }

  final exists = await file.exists();

  if (!exists) {

    print("❌ File not found: ${file.path}");

    return;
  }

  data.files.add(
    MapEntry(
      key,
      await MultipartFile.fromFile(
        file.path,
        filename: file.path.split('/').last,
      ),
    ),
  );

  print("✅ File Added: ${file.path}");
}

  Future<void> addFilesWithDesc({
    required FormData data,
    required List<File> files,
    required List<String> descriptions,
    required String fileKey,
    required String descKey,
  }) async {
    for (int i = 0; i < files.length; i++) {
      data.files.add(
        MapEntry(fileKey, await MultipartFile.fromFile(files[i].path)),
      );

      if (i < descriptions.length) {
        data.fields.add(MapEntry(descKey, descriptions[i]));
      }
    }
  }

  //todo : save user data

 
 Future<void> saveUserData(
  Map<String, dynamic> json,
) async {

  final pref = SharedPref();

  final data = json["data"] ?? {};

  final user = data["user"] ?? {};

  final tokens = data["tokens"] ?? {};

  final medicalProfile =
      user["medicalProfile"] ?? {};

  final doctorProfile =
      user["doctorProfile"] ?? {};

  /// TOKENS

  await pref.setString(
    PrefKeys.accessToken,
    tokens["accessToken"]?.toString() ?? "",
  );

  await pref.setString(
    PrefKeys.refreshToken,
    tokens["refreshToken"]?.toString() ?? "",
  );

  /// USER DATA

  /// ==============================
  /// FIX HERE
  /// ==============================

  await pref.setString(
    PrefKeys.userId,
    user["id"]?.toString() ?? "",
  );

  await pref.setString(
    PrefKeys.userRole,
    user["role"]?.toString() ?? "",
  );

  await pref.setString(
    PrefKeys.fullName,
    user["fullName"]?.toString() ?? "",
  );

  await pref.setString(
    PrefKeys.email,
    user["email"]?.toString() ?? "",
  );

  await pref.setString(
    PrefKeys.phoneNumber,
    user["phoneNumber"]?.toString() ?? "",
  );

  await pref.setString(
    PrefKeys.gender,
    user["gender"]?.toString() ?? "",
  );

  /// DOCTOR DATA

  await pref.setString(
    PrefKeys.specialization,
    doctorProfile["specialization"]?.toString() ?? "",
  );

  await pref.setString(
    PrefKeys.yearsExperience,
    doctorProfile["yearsExperience"]?.toString() ?? "",
  );

  await pref.setString(
    PrefKeys.medicalLicenseNumber,
    doctorProfile["medicalLicenseNumber"]?.toString() ?? "",
  );

  await pref.setString(
    PrefKeys.price,
    doctorProfile["price"]?.toString() ?? "",
  );

  await pref.setString(
    PrefKeys.about,
    doctorProfile["about"]?.toString() ?? "",
  );

  print(
    "============== SAVED USER DATA ==============",
  );

  print(
    "USER ID => ${user["id"]}",
  );

  print(
    "Full Name => ${user["fullName"]}",
  );

  print(
    "Role => ${user["role"]}",
  );

  print(
    "====================================",
  );
}
  // todo : login

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

      print("login respose: $response");

      await saveUserData(response);

      final loginResponse = LoginResponseDM.fromJson(response);
      return Right(loginResponse);
    } on DioException catch (e) {
      print("login error: ${e.response?.data}");
      return Left(mapExceptionToFailure(ErrorHandler.handle(e)));
    } on AppException catch (e) {
      return Left(mapExceptionToFailure(e));
    } catch (e) {
      print("unknown error: $e");
      return Left(ServerFailure());
    }
  }

  // todo : signup doctor

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

      // todo :  print data before
      print("00000000000000000000 before request .................");

      print("Fields:");
      for (var field in data.fields) {
        print(" ${field.key}: ${field.value}");
      }

      print("Files:");
      for (var file in data.files) {
        print(" ${file.key}: ${file.value.filename}");
      }

      final response = await apiManager.post(Endpoints.registerDoctor, data);

      // todo :  print data before
      print("response doctor: $response");

      await saveUserData(response);

      final doctorResponse = RegisterResponseDoctorDm.fromJson(response);
      return Right(doctorResponse);
    } on DioException catch (e) {
      print("register doctor error: ${e.response?.data}");
      return Left(mapExceptionToFailure(ErrorHandler.handle(e)));
    } on AppException catch (e) {
      return Left(mapExceptionToFailure(e));
    } catch (e) {
      print("unknown error: $e");
      return Left(ServerFailure());
    }
  }

  // todo : signup patient

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

      /// 🔎 DEBUG prints
      print("========= DEBUG REGISTER PATIENT =========");
      print("Personal Photo: ${personalPhoto?.path}");
      print("Radiology Images Count: ${radiologyImages.length}");
      print("Lab Images Count: ${labImages.length}");
      print("==========================================");

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

      // addList(data, conditions, "conditions");
      // addList(data, allergies, "allergies");

      /// conditions

/// conditions
data.fields.add(
  MapEntry(
    "conditions",
    jsonEncode(conditions),
  ),
);

/// allergies
data.fields.add(
  MapEntry(
    "allergies",
    jsonEncode(allergies),
  ),
);

      /// personal photo
      await addFile(data, personalPhoto, "personalPhoto");

      /// radiology
      await addFilesWithDesc(
        data: data,
        files: radiologyImages,
        descriptions: radiologyDescriptions,
        fileKey: "radiologyImage",
        descKey: "radiologyDescription",
      );

      /// lab tests
      await addFilesWithDesc(
        data: data,
        files: labImages,
        descriptions: labDescriptions,
        fileKey: "labImage",
        descKey: "labDescription",
      );

      /// 🔎 Print FormData before request
      print("=========== FORM DATA ===========");

      print("Fields:");
      for (var field in data.fields) {
        print("${field.key}: ${field.value}");
      }

      print("Files:");
      for (var file in data.files) {
        print("${file.key}: ${file.value.filename}");
      }

      print("=================================");

      final response = await apiManager.post(Endpoints.registerPatient, data);

      print("response patient: $response");

      await saveUserData(response);

      final result = RegisterResponsePatientDm.fromJson(response);
      return Right(result);
    } on DioException catch (e) {
      print("register patient error: ${e.response?.data}");
      return Left(mapExceptionToFailure(ErrorHandler.handle(e)));
    } on AppException catch (e) {
      return Left(mapExceptionToFailure(e));
    } catch (e) {
      print("unknown error: $e");
      return Left(ServerFailure());
    }
  }

  
  // todo: forget password

  @override
  Future<Either<Failure, ForgotPasswordDm>> forgotPassword({
    required String email,
  }) async {
    try {
      if (!await networkInfo.isConnected) {
        throw OfflineException();
      }

      final response = await apiManager.post(Endpoints.forgotPassword, {"email": email});

      print("login respose: $response");

      await saveUserData(response);

      final resetPasswordResponse =ForgotPasswordDm .fromJson(response);
      return Right(resetPasswordResponse);
    } on DioException catch (e) {
      print("login error: ${e.response?.data}");
      return Left(mapExceptionToFailure(ErrorHandler.handle(e)));
    } on AppException catch (e) {
      return Left(mapExceptionToFailure(e));
    } catch (e) {
      print("unknown error: $e");
      return Left(ServerFailure());
    }
  }
  
  @override
  Future<Either<Failure, ForgotPasswordEntity>> resetPassword({required String token, required String password, required String passwordConfirm}) async {
    try {
      if (!await networkInfo.isConnected) {
        throw OfflineException();
      }

      final response = await apiManager.patch(Endpoints.resetPassword, {

        {
  "token": token,
  "password": password,
  "passwordConfirm": passwordConfirm
}
      });

      print("login respose: $response");

      await saveUserData(response);

      final resetPasswordResponse =ForgotPasswordDm .fromJson(response);
      return Right(resetPasswordResponse);
    } on DioException catch (e) {
      print("login error: ${e.response?.data}");
      return Left(mapExceptionToFailure(ErrorHandler.handle(e)));
    } on AppException catch (e) {
      return Left(mapExceptionToFailure(e));
    } catch (e) {
      print("unknown error: $e");
      return Left(ServerFailure());
    }
  }

}
