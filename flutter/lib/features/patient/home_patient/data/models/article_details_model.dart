import 'package:Axon/features/patient/home_patient/domain/entities/article_details_entity.dart';

class ArticleDetailsModel
    extends ArticleDetailsEntity {

  ArticleDetailsModel({

    required super.id,

    required super.title,

    required super.image,

    required super.content,
  });

  factory ArticleDetailsModel.fromJson(
    Map<String, dynamic> json,
  ) {

    return ArticleDetailsModel(

      id: json["_id"] ?? "",

      title: json["title"] ?? "",

      image: json["image"] ?? "",

      content: json["content"] ?? "",
    );
  }
}