import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:Axon/core/style/colors.dart';

class HeaderIcon extends StatelessWidget {
  final IconData icon;
  final VoidCallback onTap;

  const HeaderIcon({
    required this.icon,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        width: 35.w,
        height: 35.w,
        decoration: BoxDecoration(
          color: const Color(0xFFF5F6F8),
          borderRadius: BorderRadius.circular(12.r),
        ),
        child: Icon(
          icon,
          color: AppColors.primaryColor,
          size: 22.sp,
        ),
      ),
    );
  }
}

class NotificationIcon extends StatelessWidget {
  final int count;
  final VoidCallback onTap;

  const NotificationIcon({
    required this.count,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return Stack(
      clipBehavior: Clip.none,
      children: [
        HeaderIcon(
          icon: Icons.notifications_none,
          onTap: onTap,
        ),
        if (count > 0)
          Positioned(
            top: -4,
            right: -4,
            child: Container(
              width: 18.w,
              height: 18.w,
              alignment: Alignment.center,
              decoration: const BoxDecoration(
                color: Colors.red,
                shape: BoxShape.circle,
              ),
              child: Text(
                count.toString(),
                style: TextStyle(
                  color: Colors.white,
                  fontSize: 10.sp,
                  fontWeight: FontWeight.bold,
                ),
              ),
            ),
          ),
      ],
    );
  }
}
