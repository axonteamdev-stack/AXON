import 'dart:io';

import 'package:Axon/core/helpers/snackbar.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';

part 'registration_state.dart';

class RegistrationCubit extends Cubit<RegistrationState> {
  RegistrationCubit() : super(RegistrationInitial());

  final formKey = GlobalKey<FormState>();

  final fullNameController = TextEditingController();
  final emailController = TextEditingController();
  final phoneController = TextEditingController();
  final passwordController = TextEditingController();

  int selectedGender = -1;
  bool termsAccepted = false;
  File? pickedImage;

  void pickGender(int index) {
    selectedGender = index;
    emit(GenderChanged());
  }

  void toggleTerms(bool value) {
    termsAccepted = value;
    emit(TermsChanged());
  }

  Future<void> submitRegistration(BuildContext context) async {
    if (!formKey.currentState!.validate()) {
      Snackbar.showError(context, message: "Please fill all required fields");
      return;
    }

    if (selectedGender == -1) {
      Snackbar.showError(context, message: "Please select your gender");
      return;
    }

    if (!termsAccepted) {
      Snackbar.showWarning(
        context,
        message: "Please accept Terms & Privacy Policy",
      );
      return;
    }

    emit(RegistrationLoading());
    await Future.delayed(const Duration(seconds: 1));

    Snackbar.showSuccess(
      context,
      message: "Registration completed successfully!",
    );

    emit(RegistrationSuccess());
  }

  @override
  Future<void> close() {
    fullNameController.dispose();
    emailController.dispose();
    phoneController.dispose();
    passwordController.dispose();
    return super.close();
  }
}
