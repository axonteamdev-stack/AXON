import 'package:file_picker/file_picker.dart';
import 'package:flutter/widgets.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'doctor_registration_state.dart';

class DoctorRegistrationCubit extends Cubit<DoctorRegistrationState> {
  DoctorRegistrationCubit() : super(DoctorRegistrationState());

<<<<<<< HEAD
  /// اختر التخصص
=======
>>>>>>> 0dd14dd95286373c6535852ed9ea6f14b97cafeb
  void changeSpecialization(String value) {
    emit(state.copyWith(selectedSpecialization: value));
  }

<<<<<<< HEAD
  /// Controllers
  final experienceCtrl = TextEditingController();
  final licenseCtrl = TextEditingController();

  /// Pick Medical License File
=======
  final experienceCtrl = TextEditingController();
  final licenseCtrl = TextEditingController();
  final aboutCtrl = TextEditingController();
  final priceCtrl = TextEditingController();

  void changePrice(String value) {
    emit(state.copyWith(price: value));
  }

>>>>>>> 0dd14dd95286373c6535852ed9ea6f14b97cafeb
  Future<void> pickLicenseFile() async {
    final result = await FilePicker.platform.pickFiles(
      type: FileType.custom,
      allowedExtensions: ["jpg", "jpeg", "png", "pdf"],
    );

    if (result != null) {
      final file = result.files.first;
      emit(state.copyWith(uploadedFile: file));
      print("Picked file: ${file.name}");
    }
  }

<<<<<<< HEAD
  /// Submit
=======
>>>>>>> 0dd14dd95286373c6535852ed9ea6f14b97cafeb
  void submit() {
    print("Specialization: ${state.selectedSpecialization}");
    print("Experience: ${experienceCtrl.text}");
    print("License Number: ${licenseCtrl.text}");
<<<<<<< HEAD
=======
    print("Price: ${priceCtrl.text}");
    print("About: ${aboutCtrl.text}");
>>>>>>> 0dd14dd95286373c6535852ed9ea6f14b97cafeb
    print("Uploaded File: ${state.uploadedFile?.name}");
  }
}
