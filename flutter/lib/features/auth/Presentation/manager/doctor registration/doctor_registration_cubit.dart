import 'package:Axon/core/di/di.dart';
import 'package:Axon/features/auth/Presentation/manager/selected%20gender/gender_cubit.dart';
import 'package:Axon/features/auth/domain/useCases/register_doctor_use_case.dart';
import 'package:flutter/widgets.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:image_picker/image_picker.dart';
import 'package:injectable/injectable.dart';
import 'doctor_registration_state.dart';
import 'dart:io';

enum ImageType { license, personal }

@injectable
class DoctorRegistrationCubit extends Cubit<DoctorRegistrationState> {
  final RegisterDoctorUseCase registerDoctorUseCase;
  DoctorRegistrationCubit({required this.registerDoctorUseCase})
    : super(DoctorRegistrationInitial());

  final experienceCtrl = TextEditingController();
  final licenseCtrl = TextEditingController();
  final aboutCtrl = TextEditingController();
  final priceCtrl = TextEditingController();

  final formKey = GlobalKey<FormState>();

  final fullNameController = TextEditingController();
  final emailController = TextEditingController();
  final phoneController = TextEditingController();
  final passwordController = TextEditingController();

  // ================= DATA =================

  String? selectedSpecialization;
  XFile? licenseFile;
  XFile? personalPhoto;

  final ImagePicker picker = ImagePicker();

  // ================= SPECIALIZATION =================

  void changeSpecialization(String value) {
    selectedSpecialization = value;

    emit(
      DoctorRegistrationInitial(
        selectedSpecialization: selectedSpecialization,
        licenseFile: licenseFile,
        personalFile: personalPhoto,
      ),
    );
  }

  // ================= IMAGE PICK =================

  Future<void> pickImage(ImageType type) async {
    final picked = await picker.pickImage(source: ImageSource.gallery);

    if (picked != null) {
      if (type == ImageType.license) {
        licenseFile = picked;
      } else {
        personalPhoto = picked;
      }

      emit(
        DoctorRegistrationInitial(
          selectedSpecialization: selectedSpecialization,
          licenseFile: licenseFile,
          personalFile: personalPhoto,
        ),
      );
    }
  }

  Future<void> doctorRegistration() async {
    if (formKey.currentState!.validate() == true) {
      final gender = getIt<GenderCubit>().genderValue;

      if (selectedSpecialization == null) {
        emit(DoctorRegistrationErrorMessage("Please select specialization"));
        return;
      }

      if (licenseFile == null) {
        emit(DoctorRegistrationErrorMessage("Upload license image"));
        return;
      }

      emit(DoctorRegistrationLoading());
      var either = await registerDoctorUseCase.invoke(
        personalPhoto: personalPhoto != null ? File(personalPhoto!.path) : null,
        fullName: fullNameController.text,
        email: emailController.text,
        password: passwordController.text,
        phoneNumber: phoneController.text,
        gender: gender,
        specialization: selectedSpecialization ?? "",
        yearsExperience: int.tryParse(experienceCtrl.text) ?? 0,
        medicalLicenseNumber: licenseCtrl.text,
        price: int.tryParse(priceCtrl.text) ?? 0,
        about: aboutCtrl.text,
        licenseImages: File(licenseFile!.path),
      );
      either.fold(
        (error) => emit(DoctorRegistrationError(failure: error)),
        (response) =>
            emit(DoctorRegistrationSuccess(registerDoctorEntity: response)),
      );
    }
  }
}
