import 'package:Axon/core/errors/failures.dart';
import 'package:Axon/features/patient/home_patient/domain/entities/article_details_entity.dart';
import 'package:Axon/features/patient/home_patient/domain/repo/home_repo.dart';
import 'package:dartz/dartz.dart';
import 'package:injectable/injectable.dart';

@injectable
class GetArticleDetailsUseCase {

  final HomeRepo repository;

  GetArticleDetailsUseCase(
    this.repository,
  );

  Future<Either<
      Failure,
      ArticleDetailsEntity>> call(
    String id,
  ) async {

    return await repository
        .getArticleById(id);
  }
}