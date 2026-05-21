import 'package:Axon/core/errors/failures.dart';
import 'package:Axon/features/doctor/Home%20Doctor/domain/repo/doctor_home_repo.dart';
import 'package:dartz/dartz.dart';
import 'package:injectable/injectable.dart';

@injectable
class UpdateAppointmentStatusUseCase {

  final DoctorHomeRepo repo;

  UpdateAppointmentStatusUseCase(
    this.repo,
  );

  Future<Either<
      Failure,
      String>>
  call({

    required String appointmentId,

    required String status,
  }) {

    return repo
        .updateAppointmentStatus(

      appointmentId:
          appointmentId,

      status: status,
    );
  }
}