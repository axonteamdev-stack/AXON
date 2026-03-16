import 'package:Axon/core/widgets/custom_text_field.dart';
import 'package:flutter/material.dart';

class PatientDynamicInputCard extends StatelessWidget {
  final TextEditingController controller;
  final String hint;
  final bool enabled;
  final VoidCallback? onRemove;

  const PatientDynamicInputCard({
    super.key,
    required this.controller,
    required this.hint,
    this.enabled = true,
    this.onRemove,
  });

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 12),
      child: Row(
        children: [
          Expanded(
            child: CustomTextField(
              controller: controller,
              hintText: hint,
              enabled: enabled,
              onChanged: enabled ? (_) {} : null,
            ),
          ),
          if (enabled && onRemove != null)
            IconButton(
              icon: const Icon(Icons.close, color: Colors.red),
              onPressed: onRemove,
            ),
        ],
      ),
    );
  }
}
