import 'package:Axon/core/style/app_images.dart';
import 'package:Axon/features/doctor/Profile%20Doctor/presentation/manager/profile%20doctor/doctor_profile_state.dartdoctor_profile_state.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:image_picker/image_picker.dart';
class DoctorProfileCubit extends Cubit<DoctorProfileState> {
  DoctorProfileCubit()
      : super(
          const DoctorProfileState(
            name: 'Abdallah Hassan',
            email: 'doctor@mail.com',
            profession: 'Neurologist',
            phone: '01000000000',
            experience: '8',
            licenseNumber: 'ML-123456',
            licenseImage: AppImages.onboarding2,
          ),
        ) {
    emailCtrl.text = state.email;
    phoneCtrl.text = state.phone;
    expCtrl.text = state.experience;
  }

  final emailCtrl = TextEditingController();
  final phoneCtrl = TextEditingController();
  final expCtrl = TextEditingController();

  void toggleEdit() {
    emit(state.copyWith(isEdit: !state.isEdit));
  }

  void updateProfile() {
    emit(
      state.copyWith(
        email: emailCtrl.text,
        phone: phoneCtrl.text,
        experience: expCtrl.text,
        isEdit: false,
      ),
    );
  }

  Future<void> pickImage() async {
    final image =
        await ImagePicker().pickImage(source: ImageSource.gallery);
    if (image != null) {
      emit(state.copyWith(image: image.path));
    }
  }

  @override
  Future<void> close() {
    emailCtrl.dispose();
    phoneCtrl.dispose();
    expCtrl.dispose();
    return super.close();
  }
}
