import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:flutter/material.dart';

class PatientEditProfileState {
  const PatientEditProfileState();
}

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
    dynamicControllers.removeAt(index);
    emit(const PatientEditProfileState());
  }

  List<String> getValues() {
    return dynamicControllers
        .map((e) => e.text)
        .where((e) => e.isNotEmpty)
        .toList();
  }
}
