part of 'patient_community_cubit.dart';

class PatientCommunityState {
  final List<PatientPostModel> posts;

  const PatientCommunityState({required this.posts});

  factory PatientCommunityState.initial() {
    return const PatientCommunityState(posts: []);
  }

  PatientCommunityState copyWith({
    List<PatientPostModel>? posts,
  }) {
    return PatientCommunityState(
      posts: posts ?? this.posts,
    );
  }
}
