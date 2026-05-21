import 'package:Axon/core/errors/failures.dart';
import 'package:Axon/features/patient/comunity_patient/domain/entities/comment_entity.dart';
import 'package:Axon/features/patient/comunity_patient/domain/entities/comments_entity.dart';
import 'package:Axon/features/patient/comunity_patient/domain/entities/community_post_entity.dart';
import 'package:Axon/features/patient/comunity_patient/domain/entities/community_posts_entity.dart';

import 'package:Axon/features/patient/comunity_patient/domain/usecases/add_comment_usecase.dart';
import 'package:Axon/features/patient/comunity_patient/domain/usecases/create_community_post_usecase.dart';
import 'package:Axon/features/patient/comunity_patient/domain/usecases/get_comments_usecase.dart';
import 'package:Axon/features/patient/comunity_patient/domain/usecases/get_community_posts_usecase.dart';

import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:injectable/injectable.dart';

part 'patient_community_state.dart';

@injectable
class PatientCommunityCubit
    extends Cubit<PatientCommunityState> {

  final GetCommunityPostsUseCase
      getCommunityPostsUseCase;

  final CreateCommunityPostUseCase
      createCommunityPostUseCase;

  final AddCommentUseCase
      addCommentUseCase;

  final GetCommentsUseCase
      getCommentsUseCase;

  PatientCommunityCubit(

    this.getCommunityPostsUseCase,

    this.createCommunityPostUseCase,

    this.addCommentUseCase,

    this.getCommentsUseCase,

  ) : super(
          PatientCommunityInitial(),
        );

  // ================= GET POSTS =================

  Future<void> getPosts() async {

    emit(
      PatientCommunityLoading(),
    );

    final either =
        await getCommunityPostsUseCase();

    either.fold(

      (failure) {

        emit(
          PatientCommunityError(
            failure,
          ),
        );
      },

      (posts) {

        emit(
  PatientCommunitySuccess(
    posts,
    refreshTime: DateTime.now(),
  ),
);
      },
    );
  }

  // ================= CREATE POST =================

  Future<void> createPost({

    required String title,

    required String content,

    String? imagePath,
  }) async {

    emit(
      PatientCommunityLoading(),
    );

    final either =
        await createCommunityPostUseCase(

      title: title,

      content: content,

      imagePath: imagePath,
    );

    either.fold(

      (failure) {

        emit(
          PatientCommunityError(
            failure,
          ),
        );
      },

      (_) async {

        await getPosts();
      },
    );
  }

  // ================= ADD COMMENT =================

  Future<void> addComment({

    required String postId,

    required String content,
  }) async {

    final either =
        await addCommentUseCase(

      postId: postId,

      content: content,
    );

    either.fold(

      (failure) {

        emit(
          PatientCommunityError(
            failure,
          ),
        );
      },

      (_) async {

        await getComments(
          postId: postId,
        );
      },
    );
  }

  // ================= GET COMMENTS =================

  Future<void> getComments({

    required String postId,
  }) async {

    final either =
        await getCommentsUseCase(
      postId: postId,
    );

    either.fold(

      (failure) {

        emit(
          PatientCommunityError(
            failure,
          ),
        );
      },

      (comments) {

        emit(
          PatientCommentsLoaded(
            comments,
          ),
        );
      },
    );
  }
}