import 'package:Axon/core/errors/failures.dart';
import 'package:Axon/features/doctor/Articles%20Doctor/domain/entities/create_article_entity.dart';
import 'package:Axon/features/doctor/Articles%20Doctor/domain/entities/doctor_posts_entity.dart';

abstract class DoctorArticlesState {}

class DoctorArticlesInitial extends DoctorArticlesState {}

class DoctorArticlesLoading extends DoctorArticlesState {}

class DoctorArticlesSuccess extends DoctorArticlesState {

  final CreateArticleEntity? articleEntity;

  final DoctorPostsEntity? postsEntity;

  DoctorArticlesSuccess({
    this.articleEntity,
    this.postsEntity,
  });
}

class DoctorArticlesError extends DoctorArticlesState {

  final Failure failure;

  DoctorArticlesError({
    required this.failure,
  });
}