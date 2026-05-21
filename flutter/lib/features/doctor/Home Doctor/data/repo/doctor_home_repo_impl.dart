import 'package:Axon/core/errors/failures.dart';
import 'package:Axon/features/doctor/Home%20Doctor/data/datasources/doctor_home_remote_datasource.dart';
import 'package:Axon/features/doctor/Home%20Doctor/domain/entities/pending_request_entity.dart';
import 'package:Axon/features/doctor/Home%20Doctor/domain/repo/doctor_home_repo.dart';
import 'package:dartz/dartz.dart';
import 'package:injectable/injectable.dart';

@Injectable(
  as: DoctorHomeRepo,
)
class DoctorHomeRepoImpl
    implements DoctorHomeRepo {

  final DoctorHomeRemoteDataSource
      remoteDataSource;

  DoctorHomeRepoImpl({
    required this.remoteDataSource,
  });

  @override
  Future<Either<
      Failure,
      List<PendingRequestEntity>>>
  getPendingRequests() {

    return remoteDataSource
        .getPendingRequests();
  }
}