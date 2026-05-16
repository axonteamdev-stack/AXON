import 'dart:io';

import 'package:Axon/core/service/shared_pref/shared_pref.dart';
import 'package:Axon/features/auth/Presentation/manager/doctor%20registration/doctor_registration_state.dart';
import 'package:Axon/features/auth/domain/useCases/register_doctor_use_case.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:image_picker/image_picker.dart';
import 'package:injectable/injectable.dart';

@injectable
class DoctorRegistrationCubit extends Cubit<DoctorRegistrationState> {
  final RegisterDoctorUseCase registerDoctorUseCase;
  DoctorRegistrationCubit({required this.registerDoctorUseCase})
    : super(InitialDoctorRegistration());

  // todo : data holding
  final experienceCtrl = TextEditingController(text: "5");
  final licenseCtrl = TextEditingController(text: "ML-123456");
  final aboutCtrl = TextEditingController(
    text: "Experienced doctor specialized in patient care",
  );
  final priceCtrl = TextEditingController(text: "200");

  final pref = SharedPref();
  final formKey = GlobalKey<FormState>();

  String? selectedSpecialization;

  // todo : save License image
  XFile? licenseImage;
  final ImagePicker _picker = ImagePicker();
  Future<void> pickedLicenseImage() async {
    final picker = await _picker.pickImage(source: ImageSource.gallery);
    if (picker != null) {
      licenseImage = picker;
      emit(LicenseDoctorImage());
    }
  }

  // todo : save Specialization

  void specializationSelected(String value) {
    selectedSpecialization = value;
    emit(SpecializationDoctor());
  }

  Future<void> doctorRegistration() async {
    if (formKey.currentState!.validate()) {
      try {
        emit(DoctorRegistrationLoading());
       var either = await registerDoctorUseCase.invoke(
  fullName: pref.getString("fullName") ?? '',
  email: pref.getString("email") ?? '',
  password: pref.getString("password") ?? '',
  phoneNumber: pref.getString("phone") ?? '',
  gender: pref.getString("gender") ?? '',
  specialization: selectedSpecialization ?? '',
  yearsExperience: int.tryParse(experienceCtrl.text) ?? 0,
  medicalLicenseNumber: licenseCtrl.text,
  price: int.tryParse(priceCtrl.text) ?? 0,
  about: aboutCtrl.text,
  licenseImages: File(licenseImage!.path),

  personalPhoto: null,
);
        either.fold((error) => emit(DoctorRegistrationError(failure: error)), (
          response,
        ) {
          print("Register Success: ${response.message}");
          emit(DoctorRegistrationSuccess());
        });
      } catch (e) {
        // emit(DoctorRegistrationError(failure: e.toString()));
      }
    }
  }
} 