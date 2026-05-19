import 'package:Axon/features/patient/home_patient/domain/entities/article_entity.dart';

class CreateArticleEntity {
  final bool success;
  final String message;
  final ArticleEntity article;

  const CreateArticleEntity({
    required this.success,
    required this.message,
    required this.article,
  });
}