import 'article_entity.dart';

class GetAllArticlesEntity {
  final String status;
  final String message;
  final List<ArticleEntity> articles;

  const GetAllArticlesEntity({
    required this.status,
    required this.message,
    required this.articles,
  });
}