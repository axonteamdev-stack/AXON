import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:Axon/core/style/colors.dart';
import 'package:Axon/core/widgets/text_app.dart';
import 'package:Axon/core/extensions/context_extension.dart';

class CustomAppBar extends StatelessWidget {
  final String title;

  final Widget? trailing;
  final VoidCallback? onTrailingTap;

  const CustomAppBar({
    super.key,
    required this.title,
    this.trailing,
    this.onTrailingTap,
  });

  @override
  Widget build(BuildContext context) {
    return SafeArea(
      bottom: false,
      child: Container(
        height: 100.h,
        width: double.infinity,
        padding: EdgeInsets.symmetric(horizontal: 16.w, vertical: 16.h),
        decoration: BoxDecoration(
          color: AppColors.primaryColor,
          borderRadius: BorderRadius.vertical(
            bottom: Radius.circular(12.r),
          ),
        ),
        child: Row(
          children: [
            /// ⬅ Back
            IconButton(
              icon: const Icon(
                Icons.arrow_back_ios,
                color: AppColors.white,
                size: 22,
              ),
              onPressed: () => context.pop(),
            ),

            TextApp(
              text: title,
              color: AppColors.white,
              fontSize: 18,
              weight: AppTextWeight.bold,
            ),

            const Spacer(),

            if (trailing != null)
              GestureDetector(
                onTap: onTrailingTap,
                child: trailing,
              ),
          ],
        ),
      ),
    );
  }

}
