/// medicine_remote_data_source_impl.dart
/// الكود هنا صحيح بالفعل ✅
/// لا يحتاج تعديل

import 'package:Axon/core/errors/error_handler.dart';
import 'package:Axon/core/errors/exceptions.dart';
import 'package:Axon/core/errors/failures.dart';
import 'package:Axon/core/errors/mappers/exception_to_failure_mapper.dart';
import 'package:Axon/core/network/api_manager.dart';
import 'package:Axon/core/network/endpoints.dart';
import 'package:Axon/core/network/network_info.dart';
import 'package:Axon/features/patient/medicine/data/data_sources/medicine_remote_data_source.dart';
import 'package:Axon/features/patient/medicine/data/models/delete_medicine_model.dart';
import 'package:Axon/features/patient/medicine/data/models/get_medicine_model.dart';
import 'package:Axon/features/patient/medicine/data/models/medicine_model.dart';
import 'package:Axon/features/patient/medicine/data/models/update_medicine_model.dart';

import 'package:dartz/dartz.dart';
import 'package:dio/dio.dart';
import 'package:injectable/injectable.dart';

@Injectable(as: MedicineRemoteDataSource)
class MedicineRemoteDataSourceImpl implements MedicineRemoteDataSource {
  final NetworkInfo networkInfo;
  final ApiManager apiManager;

  MedicineRemoteDataSourceImpl({
    required this.networkInfo,
    required this.apiManager,
  });

  @override
  Future<Either<Failure, MedicineModel>> addMedicine({
    required String medicineName,
    required double dosage,
    required String frequency,
    required String intakeTime,
    required String startDate,
    required String endDate,
    required String notes,
  }) async {
    try {
      if (!await networkInfo.isConnected) {
        throw OfflineException();
      }

      final response = await apiManager.post(Endpoints.addMedicine, {
        "medicineName": medicineName,
        "dosage": {"value": dosage, "unit": "mg"},
        "frequency": frequency,
        "startTime": intakeTime,
        "startDate": startDate,
        "endDate": endDate,
        "notes": notes,
      });

      print("add medicine response: $response");

      final result = MedicineModel.fromJson(response);
      return Right(result);
    } on DioException catch (e) {
      print("add medicine error: ${e.response?.data}");

      return Left(mapExceptionToFailure(ErrorHandler.handle(e)));
    } on AppException catch (e) {
      return Left(mapExceptionToFailure(e));
    } catch (e) {
      print("unknown error: $e");
      return Left(ServerFailure());
    }
  }

  @override
  Future<Either<Failure, GetMedicineModel>> getMedicines() async {
    try {
      if (!await networkInfo.isConnected) {
        throw OfflineException();
      }

      final response = await apiManager.get(Endpoints.getMedicine);

      print("get medicines response: $response");

      final result = GetMedicineModel.fromJson(response);

      return Right(result);
    } on DioException catch (e) {
      print("get medicines error: ${e.response?.data}");

      return Left(mapExceptionToFailure(ErrorHandler.handle(e)));
    } on AppException catch (e) {
      return Left(mapExceptionToFailure(e));
    } catch (e) {
      print("unknown error: $e");

      return Left(ServerFailure());
    }
  }

  @override
  Future<Either<Failure, UpdateMedicineModel>> updateMedicine({
    required String medicineId,
    required String medicineName,
    required String frequency,
    required String intakeTime,
    required String startDate,
    required String endDate,
  }) async {
    try {
      if (!await networkInfo.isConnected) {
        throw OfflineException();
      }

      final response = await apiManager
          .patch("${Endpoints.updateMedicine}/$medicineId", {
            "medicineName": medicineName,
            "frequency": frequency,
            "intakeTime": intakeTime,
            "startDate": startDate,
            "endDate": endDate,
          });

      print("update medicine response: $response");

      final result = UpdateMedicineModel.fromJson(response);

      return Right(result);
    } on DioException catch (e) {
      print("update medicine error: ${e.response?.data}");

      return Left(mapExceptionToFailure(ErrorHandler.handle(e)));
    } on AppException catch (e) {
      return Left(mapExceptionToFailure(e));
    } catch (e) {
      print("unknown error: $e");

      return Left(ServerFailure());
    }
  }

  @override
  Future<Either<Failure, DeleteMedicineModel>> deleteMedicine({
    required String medicineId,
  }) async {
    try {
      if (!await networkInfo.isConnected) {
        throw OfflineException();
      }

      final response = await apiManager.delete(
        "${Endpoints.deleteMedicine}/$medicineId",
      );

      print("delete medicine response: $response");

      final result = DeleteMedicineModel.fromJson(response);

      return Right(result);
    } on DioException catch (e) {
      print("delete medicine error: ${e.response?.data}");

      return Left(mapExceptionToFailure(ErrorHandler.handle(e)));
    } on AppException catch (e) {
      return Left(mapExceptionToFailure(e));
    } catch (e) {
      print("unknown error: $e");

      return Left(ServerFailure());
    }
  }
}
