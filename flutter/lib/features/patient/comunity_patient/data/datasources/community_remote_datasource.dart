import 'package:Axon/core/errors/failures.dart';
import 'package:Axon/features/patient/comunity_patient/data/models/create_community_post_model.dart';
import 'package:dartz/dartz.dart';

import '../models/community_posts_model.dart';
import '../models/comments_model.dart';

abstract class CommunityRemoteDataSource {

  Future<Either<Failure,
      CreateCommunityPostModel>>
  createPost({

    required String title,

    required String content,

    String? imagePath,
  });

  Future<Either<Failure,
      CommunityPostsModel>>
  getPosts();

  Future<Either<Failure,
      CommentsModel>>
  getComments({
    required String postId,
  });

  Future<Either<Failure, Unit>>
  addComment({

    required String postId,

    required String content,
  });
}