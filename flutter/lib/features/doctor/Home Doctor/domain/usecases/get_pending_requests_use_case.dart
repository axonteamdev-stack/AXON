import 'package:Axon/core/errors/failures.dart';
import 'package:Axon/features/doctor/Home%20Doctor/domain/entities/pending_request_entity.dart';
import 'package:Axon/features/doctor/Home%20Doctor/domain/repo/doctor_home_repo.dart';
import 'package:dartz/dartz.dart';
import 'package:injectable/injectable.dart';

@injectable
class GetPendingRequestsUseCase {

  final DoctorHomeRepo repo;

  GetPendingRequestsUseCase(
    this.repo,
  );

  Future<Either<
      Failure,
      List<PendingRequestEntity>>>
  call() {

    return repo.getPendingRequests();
  }
}