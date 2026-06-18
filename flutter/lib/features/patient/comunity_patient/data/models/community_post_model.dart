import 'package:Axon/features/patient/comunity_patient/domain/entities/community_post_entity.dart';

class CommunityPostModel extends CommunityPostEntity {
  CommunityPostModel({
    required super.id,
    required super.title,
    required super.content,
    super.image,
    required super.type,
    required super.authorName,
    super.authorImage,
    required super.commentsCount,
    required super.status,
    required super.views,
    required super.createdAt,
    required super.updatedAt,
  });

  factory CommunityPostModel.fromJson(Map<String, dynamic> json) {
    return CommunityPostModel(
      id: json["_id"]?.toString() ?? "",
      title: json["title"]?.toString() ?? "",
      content: json["content"]?.toString() ?? "",
      image: json["image"]?.toString(),
      type: json["type"]?.toString() ?? "",
      authorName: json["author"]?["fullName"]?.toString() ?? "",
      authorImage: json["author"]?["personalPhoto"]?.toString(),
      commentsCount: json["commentsCount"] ?? 0,
      status: json["status"]?.toString() ?? "",
      views: json["views"] ?? 0,
      createdAt: json["createdAt"] != null
          ? DateTime.parse(json["createdAt"])
          : DateTime.now(),
      updatedAt: json["updatedAt"] != null
          ? DateTime.parse(json["updatedAt"])
          : DateTime.now(),
    );
  }
}
