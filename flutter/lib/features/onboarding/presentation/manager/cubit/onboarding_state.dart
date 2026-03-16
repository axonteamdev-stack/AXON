abstract class OnBoardingState {}

class OnBoardingInitial extends OnBoardingState {}

class OnBoardingPageChanged extends OnBoardingState {
  final int index;
  OnBoardingPageChanged(this.index);
}
