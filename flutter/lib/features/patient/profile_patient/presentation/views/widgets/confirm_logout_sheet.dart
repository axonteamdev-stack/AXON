import 'package:Axon/core/extensions/localization_ext.dart';
import 'package:flutter/material.dart';
import 'package:Axon/core/style/colors.dart';
import 'package:Axon/core/widgets/custom_button.dart';
import 'package:Axon/core/widgets/text_app.dart';
import 'package:Axon/core/extensions/context_extension.dart';

class ConfirmLogoutSheet extends StatelessWidget {
  final VoidCallback onConfirm;

  const ConfirmLogoutSheet({
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
            Icons.logout,
            size: 32,
            color: Colors.grey,
          ),
          const SizedBox(height: 8),
          TextApp(
            text: context.l10n.logout,
            fontSize: 16,
            weight: AppTextWeight.semiBold,
          ),
          const SizedBox(height: 6),
          TextApp(
            text: context.l10n.logout_confirm,
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
                        text: context.l10n.cancel,
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
                  text: context.l10n.logout,
                  height: 44,
                  borderRadius: 10,
                  color: AppColors.primaryColor,
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
