import 'package:Axon/features/doctor/Articles%20Doctor/data/models/create_article_model.dart';
import 'package:dartz/dartz.dart';
import 'package:Axon/core/errors/failures.dart';

abstract class DoctorArticlesRemoteDataSource {

  Future<Either<Failure, CreateArticleModel>> createArticle({
    required String title,
    required String content,
    required String imagePath,
  });

}