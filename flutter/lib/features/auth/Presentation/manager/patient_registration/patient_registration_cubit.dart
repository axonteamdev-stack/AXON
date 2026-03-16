import 'package:flutter_bloc/flutter_bloc.dart';
import 'patient_registration_state.dart';
import 'package:flutter/material.dart';

class PatientRegistrationCubit extends Cubit<PatientRegistrationState> {
  PatientRegistrationCubit() : super(PatientRegistrationState());

  /// Controllers
  final heightCtrl = TextEditingController();
  final weightCtrl = TextEditingController();

  /// Blood Type
  void setBloodType(String v) {
    emit(state.copyWith(bloodType: v));
  }

  /// Height
  void setHeight(String v) {
    emit(state.copyWith(height: double.tryParse(v)));
  }

  /// Weight
  void setWeight(String v) {
    emit(state.copyWith(weight: double.tryParse(v)));
  }

  /// Conditions
  void toggleCondition(String condition) {
    final updated = List<String>.from(state.selectedConditions);

    updated.contains(condition)
        ? updated.remove(condition)
        : updated.add(condition);

    emit(state.copyWith(selectedConditions: updated));
  }

  /// Allergies
  void toggleAllergy(String allergy) {
    final updated = List<String>.from(state.selectedAllergies);

    updated.contains(allergy)
        ? updated.remove(allergy)
        : updated.add(allergy);

    emit(state.copyWith(selectedAllergies: updated));
  }
}
