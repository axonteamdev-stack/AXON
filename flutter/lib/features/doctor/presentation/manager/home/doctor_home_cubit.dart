import 'package:flutter_bloc/flutter_bloc.dart';

part 'doctor_home_state.dart';

class DoctorHomeCubit extends Cubit<DoctorHomeState> {
  DoctorHomeCubit() : super(DoctorHomeState.initial());

  void changeTab(DoctorHomeTab tab) {
    emit(
      state.copyWith(
        currentTab: tab,
      ),
    );
  }

  Future<void> loadDoctorHome() async {
    emit(state.copyWith(status: DoctorHomeStatus.loading));

    try {
      await Future.delayed(const Duration(seconds: 1));

      emit(
        state.copyWith(
          status: DoctorHomeStatus.success,
          chatPatients: [1, 2, 3],
          requestPatients: [1, 2, 3, 4, 5],
        ),
      );
    } catch (e) {
      emit(
        state.copyWith(
          status: DoctorHomeStatus.error,
          errorMessage: 'Something went wrong',
        ),
      );
    }
  }

  int get requestsCount => state.requestPatients.length;
}
