import 'package:Axon/core/service/shared_pref/pref_keys.dart';
import 'package:Axon/core/service/shared_pref/shared_pref.dart';
import 'package:Axon/features/doctor/Profile%20Doctor/domain/usecases/update_doctor_profile_use_case.dart';
import 'package:Axon/features/doctor/Profile%20Doctor/presentation/manager/profile%20doctor/doctor_profile_state.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:image_picker/image_picker.dart';

class DoctorProfileCubit
    extends Cubit<DoctorProfileState> {

  final UpdateDoctorProfileUseCase
      updateDoctorProfileUseCase;

  DoctorProfileCubit(
    this.updateDoctorProfileUseCase,
  )
      : super(
          const DoctorProfileState(
            name: '',
            email: '',
            profession: '',
            phone: '',
            experience: '',
            licenseNumber: '',
            licenseImage: '',
            about: '',
            price: '',
          ),
        ) {
    loadDoctorData();
  }

  // ================= CONTROLLERS =================

  final emailCtrl =
      TextEditingController();

  final phoneCtrl =
      TextEditingController();

  final expCtrl =
      TextEditingController();

  final aboutCtrl =
      TextEditingController();

  final priceCtrl =
      TextEditingController();

  // ================= SPECIALIZATION =================

  String? selectedSpecialization;

  final List<String> specializations = [
    "Cardiology",
    "Neurology",
    "Pediatrics",
    "Dentistry",
  ];

  void specializationSelected(
    String value,
  ) {

    selectedSpecialization =
        value;

    emit(
      state.copyWith(
        profession: value,
      ),
    );
  }

  // ================= LOAD DATA =================

  Future<void> loadDoctorData()
      async {

    final pref = SharedPref();

    final name =
        await pref.getString(
      PrefKeys.fullName,
    ) ?? "";

    final email =
        await pref.getString(
      PrefKeys.email,
    ) ?? "";

    final profession =
        await pref.getString(
      PrefKeys.specialization,
    ) ?? "";

    final phone =
        await pref.getString(
      PrefKeys.phoneNumber,
    ) ?? "";

    final experience =
        await pref.getString(
      PrefKeys.yearsExperience,
    ) ?? "";

    final licenseNumber =
        await pref.getString(
      PrefKeys.medicalLicenseNumber,
    ) ?? "";

    final licenseImage =
        await pref.getString(
      PrefKeys.licenseImage,
    ) ?? "";

    final about =
        await pref.getString(
      PrefKeys.about,
    ) ?? "";

    final price =
        await pref.getString(
      PrefKeys.price,
    ) ?? "";

    final image =
        await pref.getString(
      PrefKeys.personalPhoto,
    );

    selectedSpecialization =
        profession;

    emit(
      state.copyWith(
        name: name,
        email: email,
        profession: profession,
        phone: phone,
        experience: experience,
        licenseNumber:
            licenseNumber,
        licenseImage:
            licenseImage,
        about: about,
        price: price,
        image: image,
      ),
    );

    emailCtrl.text = email;

    phoneCtrl.text = phone;

    expCtrl.text = experience;

    aboutCtrl.text = about;

    priceCtrl.text = price;
  }

  // ================= TOGGLE EDIT =================

  void toggleEdit() {

    emit(
      state.copyWith(
        isEdit: !state.isEdit,
      ),
    );
  }

  // ================= UPDATE PROFILE =================

  Future<void> updateProfile()
      async {

    emit(
      state.copyWith(
        isLoading: true,
      ),
    );

    final result =
        await updateDoctorProfileUseCase(

      phoneNumber:
          phoneCtrl.text,

      yearsExperience:
          expCtrl.text,

      about:
          aboutCtrl.text,

      price:
          priceCtrl.text,

      specialization:
          selectedSpecialization ??
              state.profession,

      imagePath:
          state.image,
    );

    result.fold(

      (failure) {

        emit(
          state.copyWith(
            isLoading: false,
            errorMessage:
                failure.toString(),
          ),
        );
      },

      (success) async {

        final pref =
            SharedPref();

        await pref.setString(
          PrefKeys.phoneNumber,
          phoneCtrl.text,
        );

        await pref.setString(
          PrefKeys.yearsExperience,
          expCtrl.text,
        );

        await pref.setString(
          PrefKeys.about,
          aboutCtrl.text,
        );

        await pref.setString(
          PrefKeys.price,
          priceCtrl.text,
        );

        await pref.setString(
          PrefKeys.specialization,
          selectedSpecialization ??
              "",
        );

        if (state.image != null) {

          await pref.setString(
            PrefKeys.personalPhoto,
            state.image!,
          );
        }

        emit(
          state.copyWith(
            isLoading: false,
            isEdit: false,
            phone:
                phoneCtrl.text,
            experience:
                expCtrl.text,
            about:
                aboutCtrl.text,
            price:
                priceCtrl.text,
            profession:
                selectedSpecialization ??
                    state.profession,
          ),
        );

        print(
          success.message,
        );
      },
    );
  }

  // ================= PICK IMAGE =================

  Future<void> pickImage()
      async {

    final image =
        await ImagePicker()
            .pickImage(

      source:
          ImageSource.gallery,
    );

    if (image != null) {

      emit(
        state.copyWith(
          image: image.path,
        ),
      );
    }
  }

  // ================= LOGOUT =================

  Future<void> logout()
      async {

    final pref = SharedPref();

    await pref.clearPreferences();

    print(
      "🧹 [LOGOUT] SharedPref Cleared",
    );
  }

  // ================= DELETE ACCOUNT =================

  Future<void> deleteAccount()
      async {

    final pref = SharedPref();

    await pref.clearPreferences();

    print(
      "🗑 [DELETE ACCOUNT] SharedPref Cleared",
    );
  }

  // ================= DISPOSE =================

  @override
  Future<void> close() {

    emailCtrl.dispose();

    phoneCtrl.dispose();

    expCtrl.dispose();

    aboutCtrl.dispose();

    priceCtrl.dispose();

    return super.close();
  }
}