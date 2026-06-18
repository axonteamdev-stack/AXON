import 'package:Axon/core/errors/failures.dart';
import 'package:dartz/dartz.dart';
import 'package:Axon/features/patient/home_patient/domain/entities/user_basic_info_entity.dart';
import 'package:Axon/features/patient/home_patient/domain/repo/profile_repository.dart';
import 'package:injectable/injectable.dart';

@injectable
class GetProfileUseCase {
  final ProfileRepository repository;

  GetProfileUseCase(this.repository);

  Future<Either<Failure, UserBasicInfoEntity>> call() {
    return repository.getProfile();
  }
}