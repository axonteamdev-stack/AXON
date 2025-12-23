import 'package:flutter/widgets.dart';

class PatientEditBasicInfoState {
  final bool isEditMode;

  final TextEditingController nameCtrl;
  final TextEditingController emailCtrl;
  final TextEditingController phoneCtrl;

  PatientEditBasicInfoState({
    required this.isEditMode,
    required this.nameCtrl,
    required this.emailCtrl,
    required this.phoneCtrl,
  });

  PatientEditBasicInfoState copyWith({
    bool? isEditMode,
  }) {
    return PatientEditBasicInfoState(
      isEditMode: isEditMode ?? this.isEditMode,
      nameCtrl: nameCtrl,
      emailCtrl: emailCtrl,
      phoneCtrl: phoneCtrl,
    );
  }
}
