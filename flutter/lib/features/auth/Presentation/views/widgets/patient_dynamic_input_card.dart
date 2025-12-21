import 'package:Axon/core/widgets/custom_text_field.dart';
import 'package:flutter/material.dart';

class PatientDynamicInputCard extends StatelessWidget {
  final TextEditingController controller;
  final String hint;

  const PatientDynamicInputCard({
    super.key,
    required this.controller,
    required this.hint,
  });

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 12),
      child: CustomTextField(
        controller: controller,
        hintText: hint,
      ),
    );
  }
}
