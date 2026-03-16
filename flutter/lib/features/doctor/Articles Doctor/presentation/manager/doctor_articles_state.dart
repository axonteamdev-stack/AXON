part of 'doctor_articles_cubit.dart';

enum DoctorArticlesStatus { initial, success }

class DoctorArticlesState {
  final DoctorArticlesStatus status;
  final List<ArticleEntity> articles;

  const DoctorArticlesState({
    required this.status,
    required this.articles,
  });

  factory DoctorArticlesState.initial() {
    return const DoctorArticlesState(
      status: DoctorArticlesStatus.initial,
      articles: [],
    );
  }

  DoctorArticlesState copyWith({
    DoctorArticlesStatus? status,
    List<ArticleEntity>? articles,
  }) {
    return DoctorArticlesState(
      status: status ?? this.status,
      articles: articles ?? this.articles,
    );
  }
}

class ArticleEntity {
  final String title;
  final String content;
  final String? imagePath;

  const ArticleEntity({
    required this.title,
    required this.content,
    this.imagePath,
  });
}
