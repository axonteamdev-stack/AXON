import 'package:Axon/features/patient/comunity_patient/data/models/community_post_model.dart';


class CommunityPostModel
    extends CommunityPostEntity {

  CommunityPostModel({

    required super.id,

    required super.title,

    required super.content,

    required super.image,

    required super.type,

    required super.authorName,

    required super.authorImage,

    required super.commentsCount,

    required super.createdAt,

    required super.updatedAt,
  });

  factory CommunityPostModel.fromJson(
    Map<String, dynamic> json,
  ) {

    return CommunityPostModel(

      id:
          json["_id"]
                  ?.toString() ??
              '',

      title:
          json["title"]
                  ?.toString() ??
              '',

      content:
          json["content"]
                  ?.toString() ??
              '',

      image:
          json["image"]
              ?.toString(),

      type:
          json["type"]
                  ?.toString() ??
              '',

      authorName:
          json["author"]
                      ?["fullName"]
                  ?.toString() ??
              '',

      authorImage:
          json["author"]
              ?["personalPhoto"]
              ?.toString(),

      commentsCount:
          json["commentsCount"] ?? 0,

      createdAt:
          json["createdAt"] != null

              ? DateTime.parse(
                  json["createdAt"],
                )

              : DateTime.now(),

      updatedAt:
          json["updatedAt"] != null

              ? DateTime.parse(
                  json["updatedAt"],
                )

              : DateTime.now(),
    );
  }
}