import 'package:Axon/features/doctor/Profile%20Doctor/presentation/manager/profile%20doctor/doctor_profile_state.dartdoctor_profile_state.dart';
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
          ),
        );

  void toggleEdit() {
    emit(state.copyWith(isEdit: !state.isEdit));
  }

  void updateProfile({
    required String phone,
    required String experience,
  }) {
    emit(
      state.copyWith(
        phone: phone,
        experience: experience,
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
}
