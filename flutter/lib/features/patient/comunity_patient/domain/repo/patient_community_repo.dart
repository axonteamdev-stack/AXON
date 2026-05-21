import 'package:Axon/core/errors/failures.dart';

import 'package:Axon/features/patient/comunity_patient/data/datasources/community_remote_datasource.dart';
import 'package:Axon/features/patient/comunity_patient/data/repo/patient_community_repo_impl.dart';

import 'package:Axon/features/patient/comunity_patient/domain/entities/comments_entity.dart';

import 'package:Axon/features/patient/comunity_patient/domain/entities/community_posts_entity.dart';

import 'package:Axon/features/patient/comunity_patient/domain/repo/patient_community_repo.dart';

import 'package:dartz/dartz.dart';

import 'package:injectable/injectable.dart';

@Injectable(
  as: PatientCommunityRepo,
)
class PatientCommunityRepoImpl
    implements PatientCommunityRepo {

  final CommunityRemoteDataSource
      remoteDataSource;

  PatientCommunityRepoImpl(
    this.remoteDataSource,
  );

  // ================= GET POSTS =================

  @override
  Future<
      Either<
          Failure,
          CommunityPostsEntity>>
  getPosts() async {

    return await remoteDataSource
        .getPosts();
  }

  // ================= CREATE POST =================

  @override
  Future<
      Either<
          Failure,
          Unit>>
  createPost({

    required String title,

    required String content,

    String? imagePath,
  }) async {

    final result =
        await remoteDataSource
            .createPost(

      title: title,

      content: content,

      imagePath: imagePath,
    );

    return result.fold(

      (failure) =>
          Left(failure),

      (_) => const Right(unit),
    );
  }

  // ================= ADD COMMENT =================

  @override
  Future<
      Either<
          Failure,
          Unit>>
  addComment({

    required String postId,

    required String content,
  }) async {

    return await remoteDataSource
        .addComment(

      postId: postId,

      content: content,
    );
  }

  // ================= GET COMMENTS =================

  @override
  Future<
      Either<
          Failure,
          CommentsEntity>>
  getComments({

    required String postId,
  }) async {

    return await remoteDataSource
        .getComments(
      postId: postId,
    );
  }
}