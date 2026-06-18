import 'package:Axon/features/patient/home_patient/domain/useCases/get_profile_use_case.dart';
import 'package:Axon/features/patient/home_patient/presentation/manager/basc_info/profile_states.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:injectable/injectable.dart';

@injectable
class ProfileCubit extends Cubit<ProfileState> {
  final GetProfileUseCase getProfileUseCase;

  ProfileCubit({
    required this.getProfileUseCase,
  }) : super(ProfileInitial());

  Future<void> getProfile() async {
    emit(ProfileLoading());

    final result = await getProfileUseCase();

    result.fold(
      (failure) {
        print("PROFILE ERROR => $failure");
        emit(ProfileError(failure: failure));
      },
      (profile) {
        print("PROFILE NAME => ${profile.fullName}");
        emit(ProfileSuccess(profile: profile));
      },
    );
  }
}