import 'package:Axon/core/errors/failures.dart';

import 'package:Axon/features/patient/comunity_patient/domain/entities/comments_entity.dart';

import 'package:Axon/features/patient/comunity_patient/domain/entities/community_posts_entity.dart';

import 'package:dartz/dartz.dart';

abstract class PatientCommunityRepo {

  // ================= CREATE POST =================

  Future<
      Either<
          Failure,
          Unit>>
  createPost({

    required String title,

    required String content,

    String? imagePath,
  });

  // ================= GET POSTS =================

  Future<
      Either<
          Failure,
          CommunityPostsEntity>>
  getPosts();

  // ================= ADD COMMENT =================

  Future<
      Either<
          Failure,
          Unit>>
  addComment({

    required String postId,

    required String content,
  });

  // ================= GET COMMENTS =================

  Future<
      Either<
          Failure,
          CommentsEntity>>
  getComments({

    required String postId,
  });
}