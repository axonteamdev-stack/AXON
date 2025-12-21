import 'package:Axon/core/style/app_images.dart';
import 'package:Axon/core/style/app_text_styles.dart';
import 'package:Axon/core/style/colors.dart';
import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';

class HomeHeader extends StatelessWidget {
  final String name;
  const HomeHeader({super.key, required this.name});

  @override
  Widget build(BuildContext context) {
    return SafeArea(
      bottom: false,
      child: Container(
        height: 85.h,
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
            // ================= Profile Image =================
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
                    return Icon(
                      Icons.person,
                      size: 26,
                      color: Colors.grey,
                    );
                  },
                ),
              ),
            ),

            SizedBox(width: 12.w),

            // ================= Texts =================
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                mainAxisSize: MainAxisSize.min,
                children: [
                  Text(
                    "Good Evening, $name",
                    style: AppTextStyles.bold.copyWith(
                      fontSize: 15.sp,
                      color: Colors.white,
                    ),
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                  ),
                  SizedBox(height: 6.h),
                  Text(
                    "Your health matters",
                    style: AppTextStyles.body.copyWith(
                      color: Colors.white.withOpacity(.8),
                    ),
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                  ),
                ],
              ),
            ),

            SizedBox(width: 8.w),

            _HeaderIcon(
              icon: Icons.notifications_none,
              onTap: () {},
            ),

            SizedBox(width: 6.w),

            _HeaderIcon(
              icon: Icons.chat_bubble_outline,
              onTap: () {},
            ),
          ],
        ),
      ),
    );
  }
}

class _HeaderIcon extends StatelessWidget {
  final IconData icon;
  final VoidCallback onTap;

  const _HeaderIcon({
    required this.icon,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        width: 30.w,
        height: 33.w,
        decoration: const BoxDecoration(
          color: Colors.white,
          shape: BoxShape.circle,
        ),
        child: Icon(
          icon,
          size: 18,
          color: AppColors.primaryColor,
        ),
      ),
    );
  }
}
