
import 'package:Axon/features/patient/home_patient/data/models/article_model.dart';
import 'package:Axon/features/patient/home_patient/domain/entities/get_all_articales__entity.dart';

class GetAllArticlesModel extends GetAllArticlesEntity {
  GetAllArticlesModel({
    required super.status,
    required super.message,
    required super.articles,
  });

  factory GetAllArticlesModel.fromJson(Map<String, dynamic> json) {
    return GetAllArticlesModel(
      status: json["status"],
      message: json["message"],
      articles: List<ArticleModel>.from(
        json["data"].map((e) => ArticleModel.fromJson(e)),
      ),
    );
  }
}