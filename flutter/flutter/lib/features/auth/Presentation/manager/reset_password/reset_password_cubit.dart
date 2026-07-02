import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';

part 'reset_password_state.dart';

class ResetPasswordCubit extends Cubit<ResetPasswordState> {
  ResetPasswordCubit() : super(ResetPasswordInitial());

  final formKey = GlobalKey<FormState>();
  final emailController = TextEditingController();

  Future<void> sendResetLink(BuildContext context) async {
    if (!formKey.currentState!.validate()) return;

    emit(ResetPasswordLoading());

    try {
      await Future.delayed(const Duration(seconds: 2)); 

      emit(ResetPasswordSuccess());
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Reset link sent successfully')),
      );
    } catch (e) {
      emit(ResetPasswordFailure(e.toString()));
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Error: $e')),
      );
    }
  }

  @override
  Future<void> close() {
    emailController.dispose();
    return super.close();
  }
}