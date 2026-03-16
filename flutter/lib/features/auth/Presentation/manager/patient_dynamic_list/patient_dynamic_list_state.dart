import 'package:flutter/material.dart';

class PatientDynamicItem {
  final TextEditingController controller;

  PatientDynamicItem({String? initial})
      : controller = TextEditingController(text: initial);
}

class PatientDynamicListState {
  final List<PatientDynamicItem> items;
  final String? error;

  PatientDynamicListState({
    required this.items,
    this.error,
  });

  PatientDynamicListState copyWith({
    List<PatientDynamicItem>? items,
    String? error,
  }) {
    return PatientDynamicListState(
      items: items ?? this.items,
      error: error,
    );
  }
}
