import 'package:Axon/core/extensions/context_extension.dart';
import 'package:Axon/core/routes/app_routes.dart';
import 'package:Axon/core/style/colors.dart';
import 'package:Axon/core/widgets/text_app.dart';
import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';

class AxonAi extends StatelessWidget {
  const AxonAi({super.key});

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: () => context.pushName(AppRoutes.axonAi),
      child: Container(
        alignment: Alignment.center,
        width: double.infinity,
        margin: EdgeInsets.symmetric(horizontal: 16.h),
        padding: EdgeInsets.all(14.h),
        decoration: BoxDecoration(
          color: AppColors.white,
          borderRadius: BorderRadius.circular(12.h),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withOpacity(0.2),
              blurRadius: 18,
              offset: const Offset(0, 8),
            ),
          ],
        ),

        child: TextApp(
          text: "AXON AI",
          color: AppColors.primaryColor,
          weight: AppTextWeight.semiBold,
        ),
      ),
    );
  }
}
