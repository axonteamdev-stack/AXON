import 'package:Axon/core/style/app_images.dart';
import 'package:Axon/core/style/colors.dart';
import 'package:Axon/core/widgets/text_app.dart';
import 'package:Axon/features/patient/home_patient/presentation/views/widgets/notification_icon.dart';
import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';

class HomeHeader extends StatelessWidget {
  final String name;
  final int notificationCount;

  const HomeHeader({
    super.key,
    required this.name,
    this.notificationCount = 0,
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
          crossAxisAlignment: CrossAxisAlignment.center,
          children: [
            CircleAvatar(
              radius: 24.r,
              backgroundColor: Colors.grey.shade300,
              child: ClipOval(
                child: Image.asset(
                  AppImages.onboarding1,
                  fit: BoxFit.cover,
                  width: 48.r,
                  height: 48.r,
                  errorBuilder: (_, __, ___) {
                    return const Icon(
                      Icons.person,
                      size: 26,
                      color: Colors.grey,
                    );
                  },
                ),
              ),
            ),
            SizedBox(width: 12.w),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                mainAxisSize: MainAxisSize.min,
                children: [
                  TextApp(
                    text: "Good Evening, $name",
                    weight: AppTextWeight.bold,
                    fontSize: 15.sp,
                    color: AppColors.white,
                    maxLines: 2,
                    overflow: TextOverflow.ellipsis,
                  ),
                  SizedBox(height: 6.h),
                  TextApp(
                    text: "Your health matters",
                    fontSize: 12.sp,
                    color: AppColors.white.withOpacity(.8),
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                  ),
                ],
              ),
            ),
            SizedBox(width: 8.w),
            NotificationIcon(
              count: notificationCount,
              onTap: () {},
            ),
          ],
        ),
      ),
    );
  }
}
