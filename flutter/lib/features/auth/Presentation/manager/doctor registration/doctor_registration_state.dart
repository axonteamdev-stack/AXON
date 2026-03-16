import 'package:file_picker/file_picker.dart';

class DoctorRegistrationState {
  final String? selectedSpecialization;
  final PlatformFile? uploadedFile;
<<<<<<< HEAD
=======
  final String? price;
>>>>>>> 0dd14dd95286373c6535852ed9ea6f14b97cafeb

  DoctorRegistrationState({
    this.selectedSpecialization,
    this.uploadedFile,
<<<<<<< HEAD
=======
    this.price,
>>>>>>> 0dd14dd95286373c6535852ed9ea6f14b97cafeb
  });

  DoctorRegistrationState copyWith({
    String? selectedSpecialization,
    PlatformFile? uploadedFile,
<<<<<<< HEAD
=======
    String? price,
>>>>>>> 0dd14dd95286373c6535852ed9ea6f14b97cafeb
  }) {
    return DoctorRegistrationState(
      selectedSpecialization:
          selectedSpecialization ?? this.selectedSpecialization,
      uploadedFile: uploadedFile ?? this.uploadedFile,
<<<<<<< HEAD
=======
      price: price ?? this.price,
>>>>>>> 0dd14dd95286373c6535852ed9ea6f14b97cafeb
    );
  }
}
