import 'package:Axon/core/errors/failures.dart';
import 'package:Axon/features/doctor/Articles%20Doctor/domain/entities/create_article_entity.dart';
import 'package:Axon/features/doctor/Articles%20Doctor/domain/entities/doctor_posts_entity.dart';
import 'package:dartz/dartz.dart';

abstract class DoctorArticlesRepo {

  Future<Either<Failure, CreateArticleEntity>>
  createArticle({

    required String title,

    required String content,

    required String imagePath,
  });

  Future<Either<Failure, DoctorPostsEntity>>
  getDoctorPosts();
}