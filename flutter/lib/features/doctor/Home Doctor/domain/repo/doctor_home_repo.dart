import 'package:dartz/dartz.dart';

import '../../../../../core/errors/failures.dart';
import '../entities/pending_request_entity.dart';

abstract class DoctorHomeRepo {

  Future<Either<
      Failure,
      List<PendingRequestEntity>>>
  getPendingRequests();
}