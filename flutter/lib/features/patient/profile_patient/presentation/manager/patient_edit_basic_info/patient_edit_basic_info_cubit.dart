import 'dart:io';

import 'package:Axon/core/service/shared_pref/pref_keys.dart';
import 'package:Axon/core/service/shared_pref/shared_pref.dart';
import 'package:Axon/features/patient/profile_patient/domain/usecases/update_profile_patient_use_case.dart';
import 'package:Axon/features/patient/profile_patient/presentation/manager/patient_edit_basic_info/patient_edit_basic_info_state.dart';
import 'package:bloc/bloc.dart';
import 'package:flutter/material.dart';
import 'package:image_picker/image_picker.dart';
import 'package:injectable/injectable.dart';

@injectable
class PatientEditBasicInfoCubit
    extends Cubit<PatientEditBasicInfoState> {
  final UpdateProfilePatientUseCase updateProfilePatientUseCase;

  PatientEditBasicInfoCubit({
    required this.updateProfilePatientUseCase,
  }) : super(PatientEditBasicInfoInitial()) {
    loadPatientData();
  }

  final SharedPref sharedPref = SharedPref();

  final nameCtrl = TextEditingController();
  final emailCtrl = TextEditingController();
  final phoneCtrl = TextEditingController();
  final heightCtrl = TextEditingController();
  final weightCtrl = TextEditingController();

  final formKey = GlobalKey<FormState>();

  bool isEditMode = false;

  File? personalPhoto;

  /// ===========================
  /// Load Patient Data
  /// ===========================
  void loadPatientData() {
    nameCtrl.text =
        sharedPref.getString(PrefKeys.fullName) ?? "";

    emailCtrl.text =
        sharedPref.getString(PrefKeys.email) ?? "";

    phoneCtrl.text =
        sharedPref.getString(PrefKeys.phoneNumber) ?? "";

    heightCtrl.text =
        sharedPref.getString(PrefKeys.height) ?? "";

    weightCtrl.text =
        sharedPref.getString(PrefKeys.weight) ?? "";

    emit(PatientEditBasicInfoInitial());
  }

  /// ===========================
  /// Toggle Edit Mode
  /// ===========================
  void toggleEditMode() {
    isEditMode = !isEditMode;
    emit(PatientEditBasicInfoInitial());
  }

  /// ===========================
  /// Pick Profile Image
  /// ===========================
  Future<void> pickImage() async {
  final picker = ImagePicker();

  final XFile? pickedFile = await picker.pickImage(
    source: ImageSource.gallery,
  );

  if (pickedFile != null) {
    personalPhoto = File(pickedFile.path);

    print("========== IMAGE PICKED ==========");
    print("Path: ${personalPhoto!.path}");
    print("Name: ${personalPhoto!.path.split('/').last}");
    print("Exists: ${personalPhoto!.existsSync()}");
    print("=================================");

    emit(PatientEditBasicInfoInitial());
  } else {
    print("❌ No Image Selected");
  }
}
  /// ===========================
  /// Update Patient Profile
  /// ===========================
  Future<void> updatePatientProfile() async {
    if (formKey.currentState?.validate() != true) {
      return;
    }

    emit(PatientEditBasicInfoLoading());

    final result = await updateProfilePatientUseCase.call(
      fullName: nameCtrl.text.trim(),

      email: emailCtrl.text.trim(),

      phoneNumber: phoneCtrl.text.trim(),

      gender:
          sharedPref.getString(PrefKeys.gender) ??
              "Male",

      bloodType:
          sharedPref.getString(PrefKeys.bloodType) ??
              "O+",

      height:
          double.tryParse(heightCtrl.text.trim()) ??
              0,

      weight:
          double.tryParse(weightCtrl.text.trim()) ??
              0,

      conditions: (sharedPref
                  .getString(PrefKeys.conditions) ??
              "")
          .split(",")
          .where((e) => e.isNotEmpty)
          .toList(),

      allergies: (sharedPref
                  .getString(PrefKeys.allergies) ??
              "")
          .split(",")
          .where((e) => e.isNotEmpty)
          .toList(),

      personalPhoto: personalPhoto,

      radiologyImages: [],
      radiologyDescriptions: [],

      labImages: [],
      labDescriptions: [],
    );

    result.fold(
      (failure) {
        emit(
          PatientEditBasicInfoError(
            failure: failure,
          ),
        );
      },
      (success) async {
        await sharedPref.setString(
          PrefKeys.email,
          emailCtrl.text.trim(),
        );

        await sharedPref.setString(
          PrefKeys.phoneNumber,
          phoneCtrl.text.trim(),
        );

        await sharedPref.setString(
          PrefKeys.height,
          heightCtrl.text.trim(),
        );

        await sharedPref.setString(
          PrefKeys.weight,
          weightCtrl.text.trim(),
        );

        isEditMode = false;

        emit(
          PatientEditBasicInfoSuccess(),
        );
      },
    );
  }

  @override
  Future<void> close() {
    nameCtrl.dispose();
    emailCtrl.dispose();
    phoneCtrl.dispose();
    heightCtrl.dispose();
    weightCtrl.dispose();

    return super.close();
  }
}