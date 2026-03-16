part of 'article_details_cubit.dart';

abstract class ArticleDetailsState {}

class ArticleDetailsLoading extends ArticleDetailsState {}

class ArticleDetailsSuccess extends ArticleDetailsState {
  final ArticleDetailsModel article;

  ArticleDetailsSuccess({required this.article});
}

class ArticleDetailsError extends ArticleDetailsState {}
