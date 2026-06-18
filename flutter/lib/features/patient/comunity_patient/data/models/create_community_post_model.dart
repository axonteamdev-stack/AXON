import 'package:Axon/features/patient/comunity_patient/domain/entities/community_post_entity.dart';

class CreateCommunityPostModel extends CommunityPostEntity {
  CreateCommunityPostModel({
    required super.id,
    required super.title,
    required super.content,
    super.image,
    required super.type,
    required super.authorName,
    super.authorImage,
    required super.commentsCount,
    required super.createdAt,
    required super.updatedAt,
    required super.status,
    required super.views,
  });

  factory CreateCommunityPostModel.fromJson(Map<String, dynamic> json) {
    final post = json["data"]["post"];

    return CreateCommunityPostModel(
      id: post["_id"]?.toString() ?? "",
      title: post["title"]?.toString() ?? "",
      content: post["content"]?.toString() ?? "",
      image: post["image"]?.toString(),
      type: post["type"]?.toString() ?? "community",
      authorName: post["author"]?["fullName"]?.toString() ?? "",
      authorImage: post["author"]?["personalPhoto"]?.toString(),
      commentsCount: post["commentsCount"] ?? 0,
      status: post["status"]?.toString() ?? "published",
      views: post["views"] ?? 0,
      createdAt: post["createdAt"] != null
          ? DateTime.parse(post["createdAt"])
          : DateTime.now(),
      updatedAt: post["updatedAt"] != null
          ? DateTime.parse(post["updatedAt"])
          : DateTime.now(),
    );
  }
}
