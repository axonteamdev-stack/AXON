import 'package:Axon/core/errors/exceptions.dart';
import 'package:Axon/core/errors/failures.dart';
import 'package:Axon/core/network/network_info.dart';
import 'package:dartz/dartz.dart';


typedef RemoteCall<T> = Future<T> Function();

abstract class BaseRepository {
  final NetworkInfo networkInfo;

  BaseRepository(this.networkInfo);

  Future<Either<Failure, T>> execute<T>(
    RemoteCall<T> call,
  ) async {
    if (!await networkInfo.isConnected) {
      return Left(OfflineFailure());
    }

    try {
      final result = await call();
      return Right(result);
    } on UnauthorizedException {
      return Left(NotLoggedInFailure());
    } on BadRequestException {
      return Left(ServerFailure());
    } on NotFoundException {
      return Left(ServerFailure());
    } on TooManyRequestsException {
      return Left(TooManyRequestsFailure());
    } on TimeoutException {
      return Left(ServerFailure());
    } on ServerException {
      return Left(ServerFailure());
    } catch (_) {
      return Left(ServerFailure());
    }
  }
}