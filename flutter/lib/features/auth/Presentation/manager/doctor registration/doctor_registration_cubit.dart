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
          personalPhoto: pref.getString("personalPhoto") != null
              ? File(pref.getString("personalPhoto") ?? '')
              : null,
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


// import 'dart:io';

// import 'package:Axon/core/service/shared_pref/shared_pref.dart';
// import 'package:Axon/features/auth/domain/useCases/register_doctor_use_case.dart';
// import 'package:flutter/widgets.dart';
// import 'package:flutter_bloc/flutter_bloc.dart';
// import 'package:image_picker/image_picker.dart';
// import 'package:injectable/injectable.dart';
// import 'doctor_registration_state.dart';

// enum ImageType { license, personal }

// @injectable
// class DoctorRegistrationCubit extends Cubit<DoctorRegistrationState> {
//   final RegisterDoctorUseCase registerDoctorUseCase;

//   DoctorRegistrationCubit({required this.registerDoctorUseCase})
//       : super(DoctorRegistrationInitial());

//   // ================= CONTROLLERS =================

 

//   final formKey = GlobalKey<FormState>();

//   final fullNameController = TextEditingController(text: "Ahmed Mohamed");
//   final emailController = TextEditingController(text: "ahmed@test.com");
//   final phoneController = TextEditingController(text: "01012345678");
//   final passwordController =
//       TextEditingController(text: "P@assword123456");

//   // ================= DATA =================

//   String? selectedSpecialization;

//   XFile? licenseFile;
//   XFile? personalPhoto;

//   final ImagePicker picker = ImagePicker();
//   final prefs = SharedPref();

//   bool _isPicking = false;

//   // ================= SPECIALIZATION =================

//   void changeSpecialization(String value) {
//     selectedSpecialization = value;

//     emit(
//       DoctorRegistrationInitial(
//         selectedSpecialization: selectedSpecialization,
//         licenseFile: licenseFile,
//         personalFile: personalPhoto,
//       ),
//     );
//   }

//   // ================= IMAGE PICK =================

//   Future<void> pickImage(ImageType type) async {
//     if (_isPicking) return;

//     _isPicking = true;

//     try {
//       final picked = await picker.pickImage(source: ImageSource.gallery);

//       if (picked != null) {
//         if (type == ImageType.license) {
//           licenseFile = picked;

//           /// 🔥 تخزين license
//           await prefs.setString("licenseImage", picked.path);
//         } else {
//           personalPhoto = picked;

//           /// 🔥 تخزين profile
//           await prefs.setString("personalImage", picked.path);
//           print("💾 Personal saved: ${picked.path}");
//         }

//         emit(
//           DoctorRegistrationInitial(
//             selectedSpecialization: selectedSpecialization,
//             licenseFile: licenseFile,
//             personalFile: personalPhoto,
//           ),
//         );
//       }
//     } catch (e) {
//       print("❌ Image Picker Error: $e");
//     } finally {
//       _isPicking = false;
//     }
//   }

//   // ================= REGISTER =================

//   Future<void> doctorRegistration() async {
//     final fullName = prefs.getString("fullName");
//     final email = prefs.getString("email");
//     final phone = prefs.getString("phone");
//     final password = prefs.getString("password");
//     final gender = prefs.getString("gender");

//     /// 🔥 استرجاع الصور
//     final personalPath = prefs.getString("personalImage");
//     final licensePath = prefs.getString("licenseImage");
//     print("💾 Personal personalPath: ${personalPath}");

//     if (!formKey.currentState!.validate()) return;

//     if (selectedSpecialization == null) {
//       emit(DoctorRegistrationErrorMessage("Select specialization"));
//       return;
//     }

//     if (licensePath == null) {
//       emit(DoctorRegistrationErrorMessage("Upload license image"));
//       return;
//     }

//     emit(DoctorRegistrationLoading());

//     print("📸 personalPath: $personalPath");
//     print("📸 licensePath: $licensePath");

//     final result = await registerDoctorUseCase.invoke(
//       // ================= USER =================
//       fullName: fullName ?? "",
//       email: email ?? "",
//       password: password ?? "",
//       phoneNumber: phone ?? "",
//       gender: gender ?? "",

//       // ================= DOCTOR =================
//       specialization: selectedSpecialization!,
//       yearsExperience: int.tryParse(experienceCtrl.text) ?? 0,
//       medicalLicenseNumber: licenseCtrl.text,
//       price: int.tryParse(priceCtrl.text) ?? 0,
//       about: aboutCtrl.text,

//       // ================= FILES =================
//       personalPhoto:
//           personalPath != null ? File(personalPath) : null,

//       licenseImages: File(licensePath),
//     );

//     result.fold(
//       (error) {
//         print("❌ Register Error: ${error}");
//         emit(DoctorRegistrationError(failure: error));
//       },
//       (response) {
//         print("✅ Register Success: ${response.message}");
//         emit(DoctorRegistrationSuccess(registerDoctorEntity: response));
//       },
//     );
//   }

//   // ================= DISPOSE =================

//   @override
//   Future<void> close() {
//     experienceCtrl.dispose();
//     licenseCtrl.dispose();
//     aboutCtrl.dispose();
//     priceCtrl.dispose();

//     fullNameController.dispose();
//     emailController.dispose();
//     phoneController.dispose();
//     passwordController.dispose();

//     return super.close();
//   }
// }
