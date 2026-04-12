
import 'package:Axon/features/patient/home_patient/domain/entities/article_entity.dart';

class CreateArticleEntity {
  final String status;
  final String message;
  final ArticleEntity article;

  const CreateArticleEntity({
    required this.status,
    required this.message,
    required this.article,
  });
}