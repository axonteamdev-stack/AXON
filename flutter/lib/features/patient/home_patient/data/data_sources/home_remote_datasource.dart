import 'package:Axon/core/errors/failures.dart';
import 'package:Axon/features/patient/home_patient/data/models/article_details_model.dart';
import 'package:Axon/features/patient/home_patient/data/models/get_all_articles_model.dart';
import 'package:dartz/dartz.dart';

abstract class HomeRemoteDataSource {

  Future<Either<
      Failure,
      GetAllArticlesModel>>
  getAllArticles();
  Future<Either<Failure, ArticleDetailsModel>>
    getArticleById(String id);
}