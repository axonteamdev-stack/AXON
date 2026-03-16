import 'package:flutter/material.dart';

class EditDynamicItem {
  final TextEditingController controller;

  EditDynamicItem({String? value})
      : controller = TextEditingController(text: value ?? '');
}

class PatientEditDynamicListState {
  final bool isEditMode;
  final List<EditDynamicItem> items;

  const PatientEditDynamicListState({
    required this.isEditMode,
    required this.items,
  });

  PatientEditDynamicListState copyWith({
    bool? isEditMode,
    List<EditDynamicItem>? items,
  }) {
    return PatientEditDynamicListState(
      isEditMode: isEditMode ?? this.isEditMode,
      items: items ?? this.items,
    );
  }
}
