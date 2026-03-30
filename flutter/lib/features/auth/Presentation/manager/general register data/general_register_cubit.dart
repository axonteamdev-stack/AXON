import 'package:Axon/core/service/shared_pref/shared_pref.dart';
import 'package:Axon/features/auth/Presentation/manager/general%20register%20data/general_register_state.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:image_picker/image_picker.dart';
import 'package:injectable/injectable.dart';

@injectable
class GeneralRegisterCubit extends Cubit<GeneralRegisterState> {
  GeneralRegisterCubit() : super(InitialState());

  final formKey = GlobalKey<FormState>();

  final fullNameController = TextEditingController(text: "Ahmed Mohamed");
  final emailController = TextEditingController(text: "ahmed@test.com");
  final phoneController = TextEditingController(text: "01012345678");
  final passwordController = TextEditingController(text: "P@assword123456");

  XFile? personalPhoto;
  final ImagePicker _picker = ImagePicker();

  final pref = SharedPref();

  Future<void> pickImage() async {
    final picked = await _picker.pickImage(source: ImageSource.gallery);

    if (picked != null) {
      personalPhoto = picked;
      emit(ImagePickedState());
    }
  }

  Future<void> saveAllData(String gender) async {
   await Future.wait([
      pref.setString("fullName", fullNameController.text),
      pref.setString("email", emailController.text),
      pref.setString("phone", phoneController.text),
      pref.setString("password", passwordController.text),
      pref.setString("gender", gender),
   if  ( personalPhoto != null)
       pref.setString("personalPhoto", personalPhoto!.path),
    
    ]);

   

    print("Name: ${pref.getString("fullName")}");
    print("Email: ${pref.getString("email")}");
    print("Phone: ${pref.getString("phone")}");
    print("Password: ${pref.getString("password")}");
    print("Gender: ${pref.getString("gender")}");
    print("Image: ${pref.getString("personalPhoto")}");
  }
}
