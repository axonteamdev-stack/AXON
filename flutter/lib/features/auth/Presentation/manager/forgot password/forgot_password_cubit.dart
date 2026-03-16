import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';

part 'forgot_password_state.dart';

class ForgotPasswordCubit extends Cubit<ForgotPasswordState> {
  ForgotPasswordCubit() : super(ForgotPasswordInitial());

  final emailController = TextEditingController();
  final otpController = TextEditingController();
  final passwordController = TextEditingController();
  final confirmPasswordController = TextEditingController();

  final formKey = GlobalKey<FormState>();

  void sendEmail(BuildContext context) {
    if (!formKey.currentState!.validate()) return;
    emit(ForgotPasswordLoading());
    emit(ForgotPasswordSuccess());
  }

  void verifyOtp(BuildContext context) {
    if (!formKey.currentState!.validate()) return;
    emit(ForgotPasswordSuccess());
  }

  void resetPassword(BuildContext context) {
    if (!formKey.currentState!.validate()) return;
    emit(ForgotPasswordSuccess());
  }
}
