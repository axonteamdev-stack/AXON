import 'package:Axon/core/errors/error_handler.dart';
import 'package:Axon/core/errors/exceptions.dart';
import 'package:Axon/core/errors/failures.dart';
import 'package:Axon/core/errors/mappers/exception_to_failure_mapper.dart';
import 'package:Axon/core/network/api_manager.dart';
import 'package:Axon/core/network/endpoints.dart';
import 'package:Axon/features/doctor/Home%20Doctor/data/datasources/doctor_home_remote_datasource.dart';
import 'package:Axon/features/doctor/Home%20Doctor/data/models/pending_request_model.dart';
import 'package:dartz/dartz.dart';
import 'package:dio/dio.dart';
import 'package:injectable/injectable.dart';

@Injectable(
  as: DoctorHomeRemoteDataSource,
)
class DoctorHomeRemoteDataSourceImpl
    implements
        DoctorHomeRemoteDataSource {

  final ApiManager apiManager;

  DoctorHomeRemoteDataSourceImpl({
    required this.apiManager,
  });

  @override
  Future<Either<
      Failure,
      List<PendingRequestModel>>>
  getPendingRequests() async {

    try {

      print(
        "=========== GET PENDING REQUESTS ==========",
      );

      print(
        "📤 GET => ${Endpoints.pendingRequests}",
      );

      final response =
          await apiManager.get(
        Endpoints.pendingRequests,
      );

      print(
        "=========== RESPONSE SUCCESS ==========",
      );

      print(response);

      print(
        "=========== EXTRACT APPOINTMENTS ==========",
      );

      final List appointments =
          response['data']
              ['appointments'];

      print(
        "Appointments Count => ${appointments.length}",
      );

      print(
        "=========== MAP DATA ==========",
      );

      final requests =
          appointments.map(
        (e) {

          print(
            "Patient Name => ${e['patient']['fullName']}",
          );

          print(
            "Patient Notes => ${e['notes']}",
          );

          print(
            "Patient Image => ${e['patient']['personalPhoto']}",
          );

          return PendingRequestModel
              .fromJson(e);
        },
      ).toList();

      print(
        "=========== FINAL LIST ==========",
      );

      print(requests);

      return Right(requests);

    } on DioException catch (e) {

      print(
        "=========== DIO ERROR ==========",
      );

      print(
        "Message => ${e.message}",
      );

      print(
        "Status Code => ${e.response?.statusCode}",
      );

      print(
        "Response Data => ${e.response?.data}",
      );

      print(
        "Request Path => ${e.requestOptions.path}",
      );

      print(
        "Request Headers => ${e.requestOptions.headers}",
      );

      return Left(
        mapExceptionToFailure(
          ErrorHandler.handle(e),
        ),
      );

    } on AppException catch (e) {

      print(
        "=========== APP EXCEPTION ==========",
      );

      print(e);

      return Left(
        mapExceptionToFailure(e),
      );

    } catch (e) {

      print(
        "=========== UNKNOWN ERROR ==========",
      );

      print(e);

      return Left(
        ServerFailure(),
      );
    }
  }



  @override
Future<Either<
    Failure,
    String>>
updateAppointmentStatus({

  required String appointmentId,

  required String status,
}) async {

  try {

    print(
      "=========== UPDATE APPOINTMENT STATUS ==========",
    );

    print(
      "Appointment ID => $appointmentId",
    );

    print(
      "Status => $status",
    );

    final response =
        await apiManager.patch(

      Endpoints
          .updateAppointmentStatus(
        appointmentId,
      ),

      {
        "status": status,
      },
    );

    print(response);

    return Right(
      response['message'],
    );

  } on DioException catch (e) {

    print(
      e.response?.data,
    );

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



@override
Future<Either<
    Failure,
    List<PendingRequestModel>>>
getDoctorHistory() async {

  try {

    print(
      "=========== GET DOCTOR HISTORY ==========",
    );

    final response =
        await apiManager.get(
      Endpoints.doctorHistory,
    );

    print(response);

    final List appointments =
        response['data']
            ['appointments'];

    final acceptedAppointments =
        appointments.where(

      (e) =>
          e['status'] ==
          "accepted",
    ).toList();

    print(
      "Accepted Count => ${acceptedAppointments.length}",
    );

    final history =
        acceptedAppointments.map(

      (e) =>
          PendingRequestModel
              .fromJson(e),
    ).toList();

    return Right(history);

  } on DioException catch (e) {

    print(
      e.response?.data,
    );

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