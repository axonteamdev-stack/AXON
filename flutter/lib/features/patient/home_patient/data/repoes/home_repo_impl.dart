import 'package:Axon/core/errors/failures.dart';
import 'package:Axon/features/patient/home_patient/data/data_sources/home_remote_datasource.dart';
import 'package:Axon/features/patient/home_patient/domain/entities/get_all_articales__entity.dart';
import 'package:Axon/features/patient/home_patient/domain/repo/home_repo.dart';
import 'package:dartz/dartz.dart';
import 'package:injectable/injectable.dart';

@Injectable(
  as: HomeRepo,
)
class HomeRepoImpl
    implements HomeRepo {

  final HomeRemoteDataSource
      remoteDataSource;

  HomeRepoImpl(
    this.remoteDataSource,
  );

  @override
  Future<Either<
      Failure,
      GetAllArticlesEntity>>
  getAllArticles() async {

    final result =
        await remoteDataSource
            .getAllArticles();

    return result.fold(

      (failure) =>
          Left(failure),

      (model) =>
          Right(model),
    );
  }
}