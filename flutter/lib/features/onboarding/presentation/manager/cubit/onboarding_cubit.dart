import 'package:Axon/core/style/app_images.dart';
import 'package:Axon/features/onboarding/data/models/onboarding_model.dart';
import 'package:flutter_bloc/flutter_bloc.dart';

import 'onboarding_state.dart';

class OnBoardingCubit extends Cubit<OnBoardingState> {
  OnBoardingCubit() : super(OnBoardingInitial());

  int currentIndex = 0;

  List<OnBoardingModel> pages = [
    OnBoardingModel(
      image: AppImages.onboarding3,
      title: "Connect with the best Doctors",
      subtitle:
          "Find a doctor in any specialty and book an appointment easily from home",
    ),
    OnBoardingModel(
      image: AppImages.onboarding2,
      title: "Online Medical Consultations",
      subtitle:
          "Video sessions with the doctor while you are in your place, with an electronic prescription",
    ),
    OnBoardingModel(
      image: AppImages.onboarding1,
      title: "Track Your Health Smartly",
      subtitle:
          "Complete medical history, medication reminders, and follow-up with your doctor",
    ),
  ];

  void changePage(int index) {
    currentIndex = index;
    emit(OnBoardingPageChanged(index));
  }
}
