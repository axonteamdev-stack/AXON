import 'package:Axon/core/errors/failures.dart';
import 'package:Axon/features/doctor/Articles%20Doctor/domain/entities/create_article_entity.dart';

abstract class DoctorArticlesState {}

class DoctorArticlesInitial extends DoctorArticlesState {}

class DoctorArticlesLoading extends DoctorArticlesState {}

class DoctorArticlesSuccess extends DoctorArticlesState {
  final CreateArticleEntity? articleEntity;

  DoctorArticlesSuccess({this.articleEntity});
}

class DoctorArticlesError extends DoctorArticlesState {
  final Failure failure;

  DoctorArticlesError({required this.failure});
}