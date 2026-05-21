part of 'article_details_cubit.dart';

abstract class ArticleDetailsState {}

class ArticleDetailsInitial
    extends ArticleDetailsState {}

class ArticleDetailsLoading
    extends ArticleDetailsState {}

class ArticleDetailsSuccess
    extends ArticleDetailsState {

  final ArticleDetailsEntity article;

  ArticleDetailsSuccess({

    required this.article,
  });
}

class ArticleDetailsError
    extends ArticleDetailsState {

  final Failure failure;

  ArticleDetailsError({

    required this.failure,
  });
}