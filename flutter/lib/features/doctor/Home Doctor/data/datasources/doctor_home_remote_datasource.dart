import 'package:Axon/core/errors/failures.dart';
import 'package:Axon/features/doctor/Home%20Doctor/data/models/pending_request_model.dart';
import 'package:dartz/dartz.dart';

abstract class DoctorHomeRemoteDataSource {

  Future<Either<
      Failure,
      List<PendingRequestModel>>>
  getPendingRequests();

  Future<Either<
      Failure,
      String>>
  updateAppointmentStatus({

    required String appointmentId,

    required String status,
  });


  Future<Either<
    Failure,
    List<PendingRequestModel>>>
getDoctorHistory();
}