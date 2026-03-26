// import 'dart:io';
// import 'package:Axon/core/service/shared_pref/shared_pref.dart';
// import 'package:flutter_bloc/flutter_bloc.dart';
// import 'package:image_picker/image_picker.dart';
// import 'upload_image_state.dart';

// class UploadImageCubit extends Cubit<UploadImageState> {
//   UploadImageCubit() : super(const UploadImageState());

//   final ImagePicker _picker = ImagePicker();
//   final prefs = SharedPref();

//   Future<void> pickImage() async {
//     final XFile? file = await _picker.pickImage(source: ImageSource.gallery);

//     if (file != null) {
//       /// 🔥 خزني الصورة
//       await prefs.setString("personalImage", file.path);

//       print("💾 Saved in SharedPref: ${file.path}");

//       emit(UploadImageState(image: File(file.path)));
//     }
//   }
// }