import 'package:Axon/core/style/colors.dart';
import 'package:flutter/material.dart';

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
      leading: Icon(icon, size: dense ? 20 : 24),
      title: Text(
        title,
        style: TextStyle(fontSize: dense ? 14 : 16),
      ),
      trailing: const Icon(Icons.arrow_forward_ios, size: 14),
      onTap: onTap,
    );
  }
}
