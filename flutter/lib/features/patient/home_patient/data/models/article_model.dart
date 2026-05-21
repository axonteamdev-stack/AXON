import 'package:Axon/features/patient/home_patient/data/models/doctor_response_model.dart';
import 'package:Axon/features/patient/home_patient/domain/entities/article_entity.dart';

class ArticleModel
    extends ArticleEntity {

  ArticleModel({

    required super.id,

    super.doctor,

    required super.title,

    required super.content,

    required super.image,

    required super.createdAt,

    required super.updatedAt,
  });

  factory ArticleModel.fromJson(
    Map<String, dynamic> json,
  ) {

    return ArticleModel(

      id:
          json["_id"]?.toString() ??
              '',

      doctor:
          json["author"] != null

              ? DoctorResponseModel
                  .fromJson(
                  json["author"],
                )

              : null,

      title:
          json["title"]?.toString() ??
              '',

      content:
          json["content"]
                  ?.toString() ??
              '',

      image:
          json["image"]
                  ?.toString() ??
              '',

      createdAt:
          json["createdAt"] !=
                  null

              ? DateTime.parse(
                  json["createdAt"],
                )

              : DateTime.now(),

      updatedAt:
          json["updatedAt"] !=
                  null

              ? DateTime.parse(
                  json["updatedAt"],
                )

              : DateTime.now(),
    );
  }

  Map<String, dynamic> toJson() {

    return {

      "_id": id,

      "doctor":
          (doctor
                  as DoctorResponseModel?)
              ?.toJson(),

      "title": title,

      "content": content,

      "image": image,

      "createdAt":
          createdAt
              .toIso8601String(),

      "updatedAt":
          updatedAt
              .toIso8601String(),
    };
  }
}