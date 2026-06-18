import 'package:Axon/core/errors/failures.dart';
import 'package:Axon/features/patient/home_patient/domain/entities/user_basic_info_entity.dart';

abstract class ProfileState {}

class ProfileInitial extends ProfileState {}

class ProfileLoading extends ProfileState {}

class ProfileSuccess extends ProfileState {
  final UserBasicInfoEntity profile;

  ProfileSuccess({
    required this.profile,
  });
}

class ProfileError extends ProfileState {
  final Failure failure;

  ProfileError({
    required this.failure,
  });
}