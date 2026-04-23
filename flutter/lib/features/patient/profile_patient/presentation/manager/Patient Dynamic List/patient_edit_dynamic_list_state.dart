import 'package:flutter/material.dart';

class EditDynamicItem {
  final TextEditingController controller;

  EditDynamicItem({String? value})
      : controller = TextEditingController(
          text: value ?? '',
        );
}

class PatientEditDynamicListState {
  final bool isEditMode;
  final bool isLoading;
  final String? errorMessage;
  final List<EditDynamicItem> items;

  const PatientEditDynamicListState({
    required this.isEditMode,
    required this.isLoading,
    required this.items,
    this.errorMessage,
  });

  PatientEditDynamicListState copyWith({
    bool? isEditMode,
    bool? isLoading,
    String? errorMessage,
    List<EditDynamicItem>? items,
  }) {
    return PatientEditDynamicListState(
      isEditMode: isEditMode ?? this.isEditMode,
      isLoading: isLoading ?? this.isLoading,
      errorMessage: errorMessage,
      items: items ?? this.items,
    );
  }
}