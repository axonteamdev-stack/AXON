import 'dart:io';

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

  Future<void> addFile(FormData data, File? file, String key) async {
    if (file != null) {
      data.files.add(
        MapEntry(
          key,
          await MultipartFile.fromFile(
            file.path,
            filename: file.path.split('/').last,
          ),
        ),
      );
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
      data.files.add(
        MapEntry(fileKey, await MultipartFile.fromFile(files[i].path)),
      );

      if (i < descriptions.length) {
        data.fields.add(MapEntry(descKey, descriptions[i]));
      }
    }
  }

  //todo : save user data

 Future<void> saveUserData(Map<String, dynamic> json) async {
  final pref = SharedPref();

  final data = json["data"] ?? {};

  /// patient
  final medicalProfile = data["medicalProfile"] ?? {};

  /// doctor
  final doctorProfile = data["doctorProfile"] ?? {};

  /// ==============================
  /// General Response
  /// ==============================

  await pref.setString(
    PrefKeys.status,
    json["status"]?.toString() ?? "",
  );

  await pref.setString(
    PrefKeys.message,
    json["message"]?.toString() ?? "",
  );

  /// ==============================
  /// User Basic Data
  /// ==============================

  await pref.setString(
    PrefKeys.userId,
    data["_id"]?.toString() ?? "",
  );

  await pref.setString(
    PrefKeys.userRole,
    data["role"]?.toString() ?? "",
  );

  await pref.setString(
    PrefKeys.userEmail,
    data["email"]?.toString() ?? "",
  );

  await pref.setString(
    PrefKeys.fullName,
    data["fullName"]?.toString() ?? "",
  );

  await pref.setString(
    PrefKeys.email,
    data["email"]?.toString() ?? "",
  );

  await pref.setString(
    PrefKeys.phoneNumber,
    data["phoneNumber"]?.toString() ?? "",
  );

  await pref.setString(
    PrefKeys.gender,
    data["gender"]?.toString() ?? "",
  );

  await pref.setString(
    PrefKeys.role,
    data["role"]?.toString() ?? "",
  );

  await pref.setString(
    PrefKeys.personalPhoto,
    data["personalPhoto"]?.toString() ?? "",
  );

  await pref.setString(
    PrefKeys.isVerified,
    data["isVerified"]?.toString() ?? "",
  );

  await pref.setString(
    PrefKeys.createdAt,
    data["createdAt"]?.toString() ?? "",
  );

  await pref.setString(
    PrefKeys.updatedAt,
    data["updatedAt"]?.toString() ?? "",
  );

  /// ==============================
  /// PATIENT DATA
  /// ==============================

  await pref.setString(
    PrefKeys.bloodType,
    medicalProfile["bloodType"]?.toString() ?? "",
  );

  await pref.setString(
    PrefKeys.height,
    medicalProfile["height"]?.toString() ?? "",
  );

  await pref.setString(
    PrefKeys.weight,
    medicalProfile["weight"]?.toString() ?? "",
  );

  await pref.setString(
    PrefKeys.conditions,
    (medicalProfile["conditions"] ?? []).join(","),
  );

  await pref.setString(
    PrefKeys.allergies,
    (medicalProfile["allergies"] ?? []).join(","),
  );

  await pref.setString(
    PrefKeys.radiologyTests,
    (medicalProfile["radiologyTests"] ?? []).toString(),
  );

  await pref.setString(
    PrefKeys.labTests,
    (medicalProfile["labTests"] ?? []).toString(),
  );

  /// ==============================
  /// DOCTOR DATA
  /// ==============================

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

  await pref.setString(
    PrefKeys.licenseImage,
    doctorProfile["licenseImage"]?.toString() ?? "",
  );

  /// ==============================
  /// DEBUG PRINTS
  /// ==============================

  print("============== SAVED USER DATA ==============");
  print("Full Name => ${data["fullName"]}");
  print("Email => ${data["email"]}");
  print("Phone => ${data["phoneNumber"]}");
  print("Role => ${data["role"]}");

  print("----------- PATIENT DATA -----------");
  print("Blood Type => ${medicalProfile["bloodType"]}");
  print("Height => ${medicalProfile["height"]}");
  print("Weight => ${medicalProfile["weight"]}");
  print("Conditions => ${medicalProfile["conditions"]}");
  print("Allergies => ${medicalProfile["allergies"]}");

  print("----------- DOCTOR DATA -----------");
  print("Specialization => ${doctorProfile["specialization"]}");
  print("Years Experience => ${doctorProfile["yearsExperience"]}");
  print("Medical License => ${doctorProfile["medicalLicenseNumber"]}");
  print("Price => ${doctorProfile["price"]}");
  print("About => ${doctorProfile["about"]}");

  print("====================================");
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

      addList(data, conditions, "conditions");
      addList(data, allergies, "allergies");

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
