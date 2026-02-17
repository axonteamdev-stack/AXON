import 'package:flutter_bloc/flutter_bloc.dart';
import 'onboarding_state.dart';

class OnBoardingCubit extends Cubit<OnBoardingState> {
  OnBoardingCubit() : super(OnBoardingInitial());

  int currentIndex = 0;

  void changePage(int index) {
    currentIndex = index;
    emit(OnBoardingPageChanged(index));
  }
}
