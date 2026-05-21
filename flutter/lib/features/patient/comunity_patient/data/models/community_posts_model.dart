

import 'package:Axon/features/patient/comunity_patient/domain/entities/community_post_entity.dart';
import 'package:Axon/features/patient/comunity_patient/domain/entities/community_posts_entity.dart';

class CommunityPostsModel
    extends CommunityPostsEntity {

  CommunityPostsModel({
    required super.posts,
  });

  factory CommunityPostsModel.fromJson(
    Map<String, dynamic> json,
  ) {

    return CommunityPostsModel(

      posts:
          List<
              CommunityPostModel>.from(

        (json["data"]["posts"]
                as List)
            .map(

          (e) =>
              CommunityPostModel
                  .fromJson(e),
        ),
      ),
    );
  }
}