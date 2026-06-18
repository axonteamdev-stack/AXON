import 'package:Axon/core/errors/failures.dart';
import 'package:Axon/features/patient/home_patient/data/data_sources/profile_remote_data_source.dart';
import 'package:Axon/features/patient/home_patient/domain/entities/user_basic_info_entity.dart';
import 'package:Axon/features/patient/home_patient/domain/repo/profile_repository.dart';
import 'package:dartz/dartz.dart';
import 'package:injectable/injectable.dart';

@Injectable(as: ProfileRepository)
class ProfileRepositoryImpl implements ProfileRepository {
  final ProfileRemoteDataSource remoteDataSource;

  ProfileRepositoryImpl(this.remoteDataSource);

  @override
  Future<Either<Failure, UserBasicInfoEntity>> getProfile() async {
    try {
      final profile = await remoteDataSource.getProfile();
      return Right(profile);
    } on Failure catch (failure) {
      return Left(failure);
    } catch (_) {
      return Left(ServerFailure());
    }
  }
}
