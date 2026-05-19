import 'package:Axon/features/doctor/Articles%20Doctor/domain/entities/create_article_entity.dart';
import 'package:Axon/features/patient/home_patient/data/models/article_model.dart';

class CreateArticleModel extends CreateArticleEntity {

  const CreateArticleModel({
    required super.success,
    required super.message,
    required super.article,
  });

  factory CreateArticleModel.fromJson(Map<String, dynamic> json) {

    return CreateArticleModel(
      success: json["success"] ?? false,
      message: json["message"] ?? "",
      article: ArticleModel.fromJson(
        json["data"]["post"],
      ),
    );
  }
}