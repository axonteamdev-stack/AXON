import 'package:Axon/features/patient/comunity_patient/data/models/community_post_model.dart';
import 'package:Axon/features/patient/comunity_patient/domain/entities/community_post_entity.dart';
import 'package:Axon/features/patient/comunity_patient/domain/entities/community_posts_entity.dart';

class CommunityPostsModel extends CommunityPostsEntity {
  CommunityPostsModel({required super.posts});

  factory CommunityPostsModel.fromJson(Map<String, dynamic> json) {
    return CommunityPostsModel(
      posts: (json["data"]["posts"] as List)
          .map<CommunityPostEntity>((e) => CommunityPostModel.fromJson(e))
          .toList(),
    );
  }
}
