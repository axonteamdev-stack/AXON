import 'package:Axon/core/style/colors.dart';
import 'package:Axon/core/widgets/text_app.dart';
import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';

class QuickActionItem extends StatelessWidget {
  final String icon;
  final String label;
  final VoidCallback onTap;
  Color  ? colorIcon;

    QuickActionItem({
    required this.icon,
    required this.label,
    required this.onTap,
    this.colorIcon,

  });

  @override
  Widget build(BuildContext context) {
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(12.r),
      child: Column(
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
                width: 30.w,
                height: 30.w,
                color: colorIcon,
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
      ),
    );
  }
}