
import 'package:Axon/core/style/colors.dart';
import 'package:Axon/core/widgets/text_app.dart';
import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
class QuickActionItem extends StatelessWidget {
  final String icon;
  final String label;

  const QuickActionItem({
    required this.icon,
    required this.label,
  });

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        Container(
          width: 40.w,
          height: 40.w,
          decoration: BoxDecoration(
            color: AppColors.white,
            borderRadius: BorderRadius.circular(12.r),
            boxShadow: [
              BoxShadow(
                color: Colors.black.withOpacity(.05),
                blurRadius: 8,
                offset: const Offset(0, 3),
              ),
            ],
          ),
          child: Center(
            child: Image.asset(
              icon,
              width: 23.w,
              height: 23.w,
              color: AppColors.primaryColor,
            ),
          ),
        ),
        SizedBox(height: 6.h),
        TextApp(
          text: label,
          weight: AppTextWeight.bold,
          fontSize: 11.sp,
          color: Colors.black87,
        ),
      ],
    );
  }
}
