import 'package:Axon/features/patient/profile_patient/presentation/manager/profile%20patient/patient_profile_state.dart';
import 'package:flutter_bloc/flutter_bloc.dart';



class PatientProfileCubit extends Cubit<PatientProfileState> {
  PatientProfileCubit()
      : super(
          PatientProfileState(
            name: 'Abdalulah Hassan',
            email: 'body@example.com',
            image: '',
            weight: 75,
            age: 28,
            height: 165,
          ),
        );

  void updateProfile(PatientProfileState state) {
    emit(state);
  }

  Future<void> logout() async {
    try {
      emit(state.copyWith(status: PatientProfileStatus.loading));
      await Future.delayed(const Duration(milliseconds: 500));
      emit(state.copyWith(status: PatientProfileStatus.loggedOut));
    } catch (e) {
      emit(
        state.copyWith(
          status: PatientProfileStatus.error,
          errorMessage: 'Logout failed',
        ),
      );
    }
  }

  Future<void> deleteAccount() async {
    try {
      emit(state.copyWith(status: PatientProfileStatus.loading));
      await Future.delayed(const Duration(milliseconds: 500));
      emit(state.copyWith(status: PatientProfileStatus.accountDeleted));
    } catch (e) {
      emit(
        state.copyWith(
          status: PatientProfileStatus.error,
          errorMessage: 'Delete account failed',
        ),
      );
    }
  }
}
