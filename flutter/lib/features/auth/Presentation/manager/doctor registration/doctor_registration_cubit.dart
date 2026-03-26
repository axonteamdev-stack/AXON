import 'package:Axon/core/service/shared_pref/shared_pref.dart';
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
    bool _isPicking = false;

 final experienceCtrl = TextEditingController(text: "5");
final licenseCtrl = TextEditingController(text: "ML-123456");
final aboutCtrl = TextEditingController(
  text: "Experienced doctor specialized in patient care",
);
final priceCtrl = TextEditingController(text: "200");

final formKey = GlobalKey<FormState>();

final fullNameController = TextEditingController(text: "Ahmed Mohamed");
final emailController = TextEditingController(text: "ahmed@test.com");
final phoneController = TextEditingController(text: "01012345678");
final passwordController = TextEditingController(text: "P@assword123456");

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
  if (_isPicking) return; // 🛑 يمنع التكرار

  _isPicking = true;

  try {
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
  } catch (e) {
    print(e);
  } finally {
    _isPicking = false; // ✅ يرجع يفتح تاني
  }
}
Future<void> doctorRegistration() async {
  final prefs = SharedPref();

  final fullName = prefs.getString("fullName");
  final email = prefs.getString("email");
  final phone = prefs.getString("phone");
  final password = prefs.getString("password");
  final gender = prefs.getString("gender");
  final imagePath = prefs.getString("personalImage");

  if (!formKey.currentState!.validate()) return;

  if (selectedSpecialization == null) {
    emit(DoctorRegistrationErrorMessage("Select specialization"));
    return;
  }

  if (licenseFile == null) {
    emit(DoctorRegistrationErrorMessage("Upload license image"));
    return;
  }

  emit(DoctorRegistrationLoading());

  final result = await registerDoctorUseCase.invoke(
    // ✅ من SharedPref
    fullName: fullName ?? "",
    email: email ?? "",
    password: password ?? "",
    phoneNumber: phone ?? "",
    gender: gender ?? "",

    // ✅ من الصفحة التانية
    specialization: selectedSpecialization!,
    yearsExperience: int.tryParse(experienceCtrl.text) ?? 0,
    medicalLicenseNumber: licenseCtrl.text,
    price: int.tryParse(priceCtrl.text) ?? 0,
    about: aboutCtrl.text,

    // ✅ الصور
    personalPhoto: imagePath != null ? File(imagePath) : null,
    licenseImages: File(licenseFile!.path),
  );

  result.fold(
    (error) => emit(DoctorRegistrationError(failure: error)),
    (response) =>
        emit(DoctorRegistrationSuccess(registerDoctorEntity: response)),
  );
}}
