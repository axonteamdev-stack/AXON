import 'package:Axon/features/doctor/Articles%20Doctor/data/models/create_article_model.dart';
import 'package:Axon/features/doctor/Articles%20Doctor/data/models/doctor_posts_model.dart';
import 'package:dartz/dartz.dart';
import 'package:Axon/core/errors/failures.dart';

abstract class DoctorArticlesRemoteDataSource {

  Future<Either<Failure, CreateArticleModel>> createArticle({
    required String title,
    required String content,
    required String imagePath,
  });

 Future<Either<Failure, DoctorPostsModel>>
getDoctorPosts({
  required String doctorId,
});
}