import 'package:Axon/core/style/colors.dart';
import 'package:Axon/core/widgets/text_app.dart';
import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';

class CenterIconHeader extends StatelessWidget {
  final IconData? icon;
  final String? imagePath;
  final String? title;
  final String? subtitle;

  const CenterIconHeader({
    super.key,
    this.icon,
    this.imagePath,
    this.title,
    this.subtitle,
  });

  @override
  Widget build(BuildContext context) {
    return Center(
      child: Column(
        children: [
          Container(
            height: 65.h,
            width: 65.h,
            decoration: BoxDecoration(
              color: const Color(0xFFE8F3FF),
              shape: BoxShape.circle,
            ),
            child: Center(
              child: imagePath != null
                  ? Image.asset(
                      imagePath!,
                      width: 30.w,
                      height: 30.h,
                      fit: BoxFit.contain,
                      color: AppColors.primaryColor,
                    )
                  : Icon(icon, size: 28.sp, color: AppColors.primaryColor),
            ),
          ),

          SizedBox(height: 12.h),
          TextApp(
            text: title!,
            fontSize: 18.sp,
            weight: AppTextWeight.semiBold,
          ),

          SizedBox(height: 8.h),
          TextApp(
            text: subtitle!,
            fontSize: 11.sp,
            color: AppColors.grey,
            weight: AppTextWeight.regular,
          ),
        ],
      ),
    );
  }
}
