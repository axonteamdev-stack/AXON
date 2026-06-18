import 'package:Axon/core/errors/failures.dart';
import 'package:dartz/dartz.dart';
import 'package:Axon/features/patient/home_patient/domain/entities/user_basic_info_entity.dart';

abstract class ProfileRepository {
  Future<Either<Failure, UserBasicInfoEntity>> getProfile();
}