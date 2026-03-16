import 'package:Axon/features/patient/profile_patient/presentation/manager/change_password/change_password_state.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:flutter/material.dart';

class ChangePasswordCubit extends Cubit<ChangePasswordState> {
  ChangePasswordCubit() : super(const ChangePasswordState());

  final formKey = GlobalKey<FormState>();

  final currentCtrl = TextEditingController();
  final newCtrl = TextEditingController();
  final confirmCtrl = TextEditingController();

  void submit(BuildContext context) {
    if (formKey.currentState!.validate()) {
      FocusScope.of(context).unfocus();
    }
  }

  @override
  Future<void> close() {
    currentCtrl.dispose();
    newCtrl.dispose();
    confirmCtrl.dispose();
    return super.close();
  }
}
