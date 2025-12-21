import 'package:Axon/core/style/app_text_styles.dart';
import 'package:Axon/core/style/colors.dart';
import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';

class DoctorsSectionHeader extends StatelessWidget {
  final VoidCallback? onViewAll;

  const DoctorsSectionHeader({super.key, this.onViewAll});

  @override
  Widget build(BuildContext context) {
    return Row(
      children: [
        Text(
          "Doctors",
          style: AppTextStyles.semiBold.copyWith(fontSize: 14.sp),
        ),
        const Spacer(),
        GestureDetector(
          onTap: onViewAll,
          child: Text(
            "View All",
            style: AppTextStyles.body.copyWith(
              fontSize: 12.sp,
              color: AppColors.primaryColor,
            ),
          ),
        ),
      ],
    );
  }
}
