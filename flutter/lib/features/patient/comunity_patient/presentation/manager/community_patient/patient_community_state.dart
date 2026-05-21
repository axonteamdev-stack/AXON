part of 'patient_community_cubit.dart';

abstract class PatientCommunityState {}

class PatientCommunityInitial
    extends PatientCommunityState {}

class PatientCommunityLoading
    extends PatientCommunityState {}

class PatientCommunitySuccess
    extends PatientCommunityState {

  final CommunityPostsEntity posts;

  final DateTime refreshTime;

  PatientCommunitySuccess(
    this.posts, {
    DateTime? refreshTime,
  }) : refreshTime =
            refreshTime ??
            DateTime.now();
}

class PatientCommunityError
    extends PatientCommunityState {

  final Failure failure;

  PatientCommunityError(
    this.failure,
  );
}

class PatientCommentsLoaded
    extends PatientCommunityState {

  final CommentsEntity comments;

  PatientCommentsLoaded(
    this.comments,
  );
}