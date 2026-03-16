import 'package:file_picker/file_picker.dart';

class DoctorRegistrationState {
  final String? selectedSpecialization;
  final PlatformFile? uploadedFile;
  final String? price;

  DoctorRegistrationState({
    this.selectedSpecialization,
    this.uploadedFile,
    this.price,
  });

  DoctorRegistrationState copyWith({
    String? selectedSpecialization,
    PlatformFile? uploadedFile,
    String? price,
  }) {
    return DoctorRegistrationState(
      selectedSpecialization:
          selectedSpecialization ?? this.selectedSpecialization,
      uploadedFile: uploadedFile ?? this.uploadedFile,
      price: price ?? this.price,
    );
  }
}
