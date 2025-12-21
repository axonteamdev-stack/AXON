import 'package:Axon/core/style/app_images.dart';
import 'package:Axon/core/style/colors.dart';
import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';

class QuickActionsSection extends StatelessWidget {
  const QuickActionsSection({super.key});

  @override
  Widget build(BuildContext context) {
    final items = const [
      _QuickActionItem(
        icon: AppImages.book,
        label: 'Book',
      ),
      _QuickActionItem(
        icon: AppImages.hospital,
        label: 'Hospitals',
      ),
      _QuickActionItem(
        icon: AppImages.Med,
        label: 'Medicals',
      ),
      _QuickActionItem(
        icon: AppImages.History,
        label: 'History',
      ),
    ];

    return Padding(
padding: EdgeInsets.symmetric(horizontal: 20.w),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            "Quick Actions",
            style: TextStyle(
              fontSize: 14.sp,
              fontWeight: FontWeight.w600,
            ),
          ),
          SizedBox(height: 12.h),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: items,
          ),
        ],
      ),
    );
  }
}

// =======================================================

class _QuickActionItem extends StatelessWidget {
  final String icon;
  final String label;

  const _QuickActionItem({
    required this.icon,
    required this.label,
  });

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        Container(
          width: 68.w,
          height: 68.w,
          decoration: BoxDecoration(
            color: AppColors.white,
            borderRadius: BorderRadius.circular(16.r),
            boxShadow: [
              BoxShadow(
                color: Colors.black.withOpacity(.05),
                blurRadius: 10,
                offset: const Offset(0, 4),
              ),
            ],
          ),
          child: Center(
            child: Image.asset(
              icon,
              width: 24.w,
              height: 24.w,
              color: AppColors.primaryColor,
            ),
          ),
        ),
        SizedBox(height: 8.h),
        Text(
          label,
          style: TextStyle(
            fontSize: 12.sp,
            color: Colors.black87,
          ),
        ),
      ],
    );
  }
}
