import 'package:Axon/core/errors/error_handler.dart';
import 'package:Axon/core/errors/exceptions.dart';
import 'package:Axon/core/errors/failures.dart';
import 'package:Axon/core/errors/mappers/exception_to_failure_mapper.dart';
import 'package:Axon/core/network/api_manager.dart';
import 'package:Axon/core/network/endpoints.dart';

import 'package:Axon/features/patient/comunity_patient/data/datasources/community_remote_datasource.dart';

import 'package:Axon/features/patient/comunity_patient/data/models/comments_model.dart';
import 'package:Axon/features/patient/comunity_patient/data/models/community_posts_model.dart';
import 'package:Axon/features/patient/comunity_patient/data/models/create_community_post_model.dart';

import 'package:dartz/dartz.dart';
import 'package:dio/dio.dart';
import 'package:injectable/injectable.dart';

@Injectable(
  as: CommunityRemoteDataSource,
)
class CommunityRemoteDataSourceImpl
    implements CommunityRemoteDataSource {

  final ApiManager apiManager;

  CommunityRemoteDataSourceImpl({
    required this.apiManager,
  });

  // ================= CREATE POST =================

  @override
  Future<
      Either<
          Failure,
          CreateCommunityPostModel>>
  createPost({

    required String title,

    required String content,

    String? imagePath,
  }) async {

    try {

     final formData = FormData.fromMap({

  "title": title,

  "content": content,

  "tags": '["journey","health"]',

  if (imagePath != null)
    "postImage":
        await MultipartFile.fromFile(
      imagePath,
    ),
});

      final response =
          await apiManager.post(

        Endpoints.createCommunityPost,

        formData,
      );

      print(
        "CREATE POST RESPONSE => $response",
      );

      return Right(

        CreateCommunityPostModel
            .fromJson(response),
      );

    } on DioException catch (e) {

      print(
        "CREATE POST ERROR => ${e.response?.data}",
      );

      return Left(

        mapExceptionToFailure(

          ErrorHandler.handle(e),
        ),
      );

    } on AppException catch (e) {

      return Left(
        mapExceptionToFailure(e),
      );

    } catch (e) {

      print(
        "UNKNOWN CREATE POST ERROR => $e",
      );

      return Left(
        ServerFailure(),
      );
    }
  }

  // ================= GET POSTS =================

  @override
  Future<
      Either<
          Failure,
          CommunityPostsModel>>
  getPosts() async {

    try {

      final response =
          await apiManager.get(

        Endpoints.getCommunityPosts,
      );

      print(
        "GET POSTS RESPONSE => $response",
      );

      return Right(

        CommunityPostsModel
            .fromJson(response),
      );

    } on DioException catch (e) {

      print(
        "GET POSTS ERROR => ${e.response?.data}",
      );

      return Left(

        mapExceptionToFailure(

          ErrorHandler.handle(e),
        ),
      );

    } on AppException catch (e) {

      return Left(
        mapExceptionToFailure(e),
      );

    } catch (e) {

      print(
        "UNKNOWN GET POSTS ERROR => $e",
      );

      return Left(
        ServerFailure(),
      );
    }
  }

  // ================= GET COMMENTS =================

  @override
  Future<
      Either<
          Failure,
          CommentsModel>>
  getComments({

    required String postId,
  }) async {

    try {

      final response =
          await apiManager.get(

        Endpoints.getComments(
          postId,
        ),
      );

      print(
        "GET COMMENTS RESPONSE => $response",
      );

      return Right(

        CommentsModel.fromJson(
          response,
        ),
      );

    } on DioException catch (e) {

      print(
        "GET COMMENTS ERROR => ${e.response?.data}",
      );

      return Left(

        mapExceptionToFailure(

          ErrorHandler.handle(e),
        ),
      );

    } on AppException catch (e) {

      return Left(
        mapExceptionToFailure(e),
      );

    } catch (e) {

      print(
        "UNKNOWN GET COMMENTS ERROR => $e",
      );

      return Left(
        ServerFailure(),
      );
    }
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

    try {

      final response =
          await apiManager.post(

        Endpoints.addComment(
          postId,
        ),

        {
          "content": content,
        },
      );

      print(
        "ADD COMMENT RESPONSE => $response",
      );

      return const Right(
        unit,
      );

    } on DioException catch (e) {

      print(
        "ADD COMMENT ERROR => ${e.response?.data}",
      );

      return Left(

        mapExceptionToFailure(

          ErrorHandler.handle(e),
        ),
      );

    } on AppException catch (e) {

      return Left(
        mapExceptionToFailure(e),
      );

    } catch (e) {

      print(
        "UNKNOWN ADD COMMENT ERROR => $e",
      );

      return Left(
        ServerFailure(),
      );
    }
  }
}