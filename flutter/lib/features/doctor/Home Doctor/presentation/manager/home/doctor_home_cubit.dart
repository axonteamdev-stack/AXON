import 'package:Axon/core/style/app_images.dart';
import 'package:Axon/features/doctor/Home%20Doctor/data/models/chat_patient.dart';
import 'package:flutter_bloc/flutter_bloc.dart';

part 'doctor_home_state.dart';

class DoctorHomeCubit extends Cubit<DoctorHomeState> {
  DoctorHomeCubit() : super(DoctorHomeState.initial());

  void changeTab(DoctorHomeTab tab) {
    emit(state.copyWith(currentTab: tab));
  }

  Future<void> loadDoctorHome() async {
    emit(state.copyWith(status: DoctorHomeStatus.loading));

    await Future.delayed(const Duration(seconds: 1));

    emit(
      state.copyWith(
        status: DoctorHomeStatus.success,
        chatPatients: [
          ChatPatient(
            name: 'Abdallah Hassan',
            description: 'Back pain and spinal discomfort',
            image: AppImages.onboarding3,
          ),
          ChatPatient(
            name: 'SS Mohamed',
            description: 'Chronic neck pain',
            image: AppImages.onboarding2,
          ),
          ChatPatient(
            name: 'seif Ragab',
            description: 'Lower back stiffness',
            image: AppImages.onboarding1,
          ),
          ChatPatient(
            name: 'Mohamed Elaraky',
            description: 'Shoulder pain after injury',
            image: AppImages.onboarding3,
          ),
          ChatPatient(
            name: 'Ahmed Hassan',
            description: 'Spinal nerve irritation',
            image: AppImages.onboarding1,
          ),
        ],
        requestPatients: List.generate(7, (index) => index),
      ),
    );
  }

  int get requestsCount => state.requestPatients.length;
}
