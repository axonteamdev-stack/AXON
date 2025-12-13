import 'package:file_picker/file_picker.dart';

class DoctorRegistrationState {
  final String? selectedSpecialization;
  final PlatformFile? uploadedFile;

  DoctorRegistrationState({
    this.selectedSpecialization,
    this.uploadedFile,
  });

  DoctorRegistrationState copyWith({
    String? selectedSpecialization,
    PlatformFile? uploadedFile,
  }) {
    return DoctorRegistrationState(
      selectedSpecialization:
          selectedSpecialization ?? this.selectedSpecialization,
      uploadedFile: uploadedFile ?? this.uploadedFile,
    );
  }
}
