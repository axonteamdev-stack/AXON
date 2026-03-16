import 'package:Axon/features/patient/profile_patient/presentation/manager/profile%20patient%20edit/patient_edit_profile_state.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:flutter/material.dart';



class PatientEditProfileCubit extends Cubit<PatientEditProfileState> {
  PatientEditProfileCubit() : super(const PatientEditProfileState());

  final TextEditingController nameCtrl = TextEditingController();
  final TextEditingController phoneCtrl = TextEditingController();
  final TextEditingController heightCtrl = TextEditingController();
  final TextEditingController weightCtrl = TextEditingController();

  final List<TextEditingController> dynamicControllers = [];

  void addField() {
    dynamicControllers.add(TextEditingController());
    emit(const PatientEditProfileState());
  }

  void removeField(int index) {
    if (index < 0 || index >= dynamicControllers.length) return;
    dynamicControllers[index].dispose();
    dynamicControllers.removeAt(index);
    emit(const PatientEditProfileState());
  }

  List<String> getValues() {
    return dynamicControllers
        .map((e) => e.text.trim())
        .where((e) => e.isNotEmpty)
        .toList();
  }

  void clearAll() {
    for (final c in dynamicControllers) {
      c.dispose();
    }
    dynamicControllers.clear();
    emit(const PatientEditProfileState());
  }

  @override
  Future<void> close() {
    nameCtrl.dispose();
    phoneCtrl.dispose();
    heightCtrl.dispose();
    weightCtrl.dispose();

    for (final c in dynamicControllers) {
      c.dispose();
    }

    return super.close();
  }
}
