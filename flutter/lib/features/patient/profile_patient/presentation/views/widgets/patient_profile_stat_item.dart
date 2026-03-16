import 'package:flutter/material.dart';
import 'package:Axon/core/widgets/text_app.dart';

class PatientProfileStatItem extends StatelessWidget {
  final String value;
  final String label;

  const PatientProfileStatItem({
    super.key,
    required this.value,
    required this.label,
  });

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        TextApp(
          text: value,
          fontSize: 16,
          weight: AppTextWeight.bold,
        ),
        const SizedBox(height: 4),
        TextApp(
          text: label,
          fontSize: 12,
          color: Colors.grey,
        ),
      ],
    );
  }
}
