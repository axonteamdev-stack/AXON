import '../../domain/entities/comment_entity.dart';

class CommentModel
    extends CommentEntity {

  CommentModel({

    required super.id,

    required super.content,

    required super.authorName,

    required super.authorImage,

    required super.createdAt,
  });

  factory CommentModel.fromJson(
    Map<String, dynamic> json,
  ) {

    return CommentModel(

      id:
          json["_id"]
                  ?.toString() ??
              '',

      content:
          json["content"]
                  ?.toString() ??
              '',

      authorName:
          json["author"]
                      ?["fullName"]
                  ?.toString() ??
              '',

      authorImage:
          json["author"]
              ?["personalPhoto"],

      createdAt:
          json["createdAt"] !=
                  null

              ? DateTime.parse(
                  json["createdAt"],
                )

              : DateTime.now(),
    );
  }
}