import 'package:flutter/material.dart';
import 'package:Axon/core/style/colors.dart';
import 'package:Axon/core/widgets/text_app.dart';

class PatientProfileMenuItem extends StatelessWidget {
  final IconData icon;
  final String title;
  final VoidCallback onTap;
  final bool dense;

  const PatientProfileMenuItem({
    super.key,
    required this.icon,
    required this.title,
    required this.onTap,
    this.dense = false,
  });

  @override
  Widget build(BuildContext context) {
    return ListTile(
      dense: dense,
      contentPadding:
          const EdgeInsets.symmetric(horizontal: 16, vertical: 2),
      leading: Icon(
        icon,
        size: dense ? 20 : 24,
        color: AppColors.black,
      ),
      title: TextApp(
        text: title,
        fontSize: dense ? 14 : 16,
        weight: AppTextWeight.regular,
        color: AppColors.black,
      ),
      trailing: const Icon(
        Icons.arrow_forward_ios,
        size: 14,
        color: AppColors.grey,
      ),
      onTap: onTap,
    );
  }
}
