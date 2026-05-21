import 'package:dartz/dartz.dart';

import '../../../../../core/errors/failures.dart';
import '../models/pending_request_model.dart';

abstract class DoctorHomeRemoteDataSource {

  Future<Either<
      Failure,
      List<PendingRequestModel>>>
  getPendingRequests();
}