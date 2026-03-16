import 'package:Axon/features/patient/comunity_patient/data/models/patient_post_model.dart';
import 'package:flutter_bloc/flutter_bloc.dart';

part 'patient_community_state.dart';

class PatientCommunityCubit extends Cubit<PatientCommunityState> {
  PatientCommunityCubit() : super(PatientCommunityState.initial());

  void addPost({
    required String title,
    required String content,
    String? imagePath,
  }) {
    final post = PatientPostModel(
      id: DateTime.now().millisecondsSinceEpoch.toString(),
      title: title,
      content: content,
      imagePath: imagePath,
    );

    emit(state.copyWith(posts: [post, ...state.posts]));
  }

  void toggleLikePost(String postId) {
    final updated = state.posts.map((post) {
      if (post.id == postId) {
        return PatientPostModel(
          id: post.id,
          title: post.title,
          content: post.content,
          imagePath: post.imagePath,
          isLiked: !post.isLiked,
          likes: post.isLiked ? post.likes - 1 : post.likes + 1,
          shares: post.shares,
          comments: post.comments,
        );
      }
      return post;
    }).toList();

    emit(state.copyWith(posts: updated));
  }

  void addComment(String postId, String text) {
    final updated = state.posts.map((post) {
      if (post.id == postId) {
        final newComments = List<PostComment>.from(post.comments)
          ..add(
            PostComment(
              id: DateTime.now().millisecondsSinceEpoch.toString(),
              text: text,
            ),
          );

        return PatientPostModel(
          id: post.id,
          title: post.title,
          content: post.content,
          imagePath: post.imagePath,
          isLiked: post.isLiked,
          likes: post.likes,
          shares: post.shares,
          comments: newComments,
        );
      }
      return post;
    }).toList();

    emit(state.copyWith(posts: updated));
  }

  void toggleLikeComment(String postId, String commentId) {
    final updated = state.posts.map((post) {
      if (post.id == postId) {
        final comments = post.comments.map((c) {
          if (c.id == commentId) {
            return PostComment(
              id: c.id,
              text: c.text,
              isLiked: !c.isLiked,
              likes: c.isLiked ? c.likes - 1 : c.likes + 1,
              replies: c.replies,
            );
          }
          return c;
        }).toList();

        return PatientPostModel(
          id: post.id,
          title: post.title,
          content: post.content,
          imagePath: post.imagePath,
          isLiked: post.isLiked,
          likes: post.likes,
          shares: post.shares,
          comments: comments,
        );
      }
      return post;
    }).toList();

    emit(state.copyWith(posts: updated));
  }

  void addReply(String postId, String commentId, String text) {
    final updated = state.posts.map((post) {
      if (post.id == postId) {
        final comments = post.comments.map((c) {
          if (c.id == commentId) {
            final replies = List<PostReply>.from(c.replies)
              ..add(
                PostReply(
                  id: DateTime.now().millisecondsSinceEpoch.toString(),
                  text: text,
                ),
              );

            return PostComment(
              id: c.id,
              text: c.text,
              isLiked: c.isLiked,
              likes: c.likes,
              replies: replies,
            );
          }
          return c;
        }).toList();

        return PatientPostModel(
          id: post.id,
          title: post.title,
          content: post.content,
          imagePath: post.imagePath,
          isLiked: post.isLiked,
          likes: post.likes,
          shares: post.shares,
          comments: comments,
        );
      }
      return post;
    }).toList();

    emit(state.copyWith(posts: updated));
  }
}
