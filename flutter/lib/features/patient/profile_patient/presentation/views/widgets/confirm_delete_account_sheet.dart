import 'package:flutter/material.dart';
import 'package:Axon/core/style/colors.dart';
import 'package:Axon/core/widgets/custom_button.dart';
import 'package:Axon/core/widgets/text_app.dart';

class ConfirmDeleteAccountSheet extends StatelessWidget {
  final VoidCallback onConfirm;

  const ConfirmDeleteAccountSheet({
    super.key,
    required this.onConfirm,
  });

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.all(18),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          const Icon(
            Icons.delete_outline,
            size: 32,
            color: Color(0xFFE53935),
          ),
          const SizedBox(height: 8),
          const TextApp(
            text: 'Delete Account',
            fontSize: 16,
            weight: AppTextWeight.semiBold,
          ),
          const SizedBox(height: 6),
          const TextApp(
            text: 'This action is permanent and cannot be undone.',
            fontSize: 13,
            color: Colors.grey,
            textAlign: TextAlign.center,
          ),
          const SizedBox(height: 18),
          Row(
            children: [
              Expanded(
                child: InkWell(
                  borderRadius: BorderRadius.circular(10),
                  onTap: () => Navigator.pop(context),
                  child: Container(
                    height: 44,
                    decoration: BoxDecoration(
                      borderRadius: BorderRadius.circular(10),
                      border: Border.all(
                        color: AppColors.primaryColor,
                        width: 1,
                      ),
                    ),
                    child: Center(
                      child: TextApp(
                        text: 'Cancel',
                        fontSize: 14,
                        weight: AppTextWeight.semiBold,
                        color: AppColors.primaryColor,
                      ),
                    ),
                  ),
                ),
              ),
              const SizedBox(width: 10),
              Expanded(
                child: CustomButton(
                  text: 'Delete',
                  height: 44,
                  borderRadius: 10,
                  color: const Color(0xFFE53935),
                  textColor: Colors.white,
                  fontSize: 14,
                  onPressed: onConfirm,
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }
}
