import 'package:Axon/core/routes/app_routes.dart';
import 'package:Axon/core/style/colors.dart';
import 'package:Axon/core/style/app_images.dart';
import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';

class HomeBottomNavBar extends StatefulWidget {
  const HomeBottomNavBar({super.key});

  @override
  State<HomeBottomNavBar> createState() => _HomeBottomNavBarState();
}

class _HomeBottomNavBarState extends State<HomeBottomNavBar> {
  int currentIndex = 0;

  final items = const [
    _NavItem(AppImages.home, 'Home'),
    _NavItem(AppImages.chat, 'Chats'),
    _NavItem(AppImages.community, 'Community'),
    _NavItem(AppImages.profile, 'Profile'),
  ];

  void _onTap(int index) {
    setState(() => currentIndex = index);


     if (index == 0) {
      Navigator.pushNamed(context, AppRoutes.home);
    }
    else if (index == 1) {
      // Navigator.pushNamed(context, AppRoutes.chats);
    }
    else if (index == 2) {
      // Navigator.pushNamed(context, AppRoutes.community);
    }
 if (index == 3) {
      // Navigator.pushNamed(context, AppRoutes.patientProfile);
    }
  }

  @override
  Widget build(BuildContext context) {
    return SafeArea(
      top: false,
      child: Padding(
        padding: EdgeInsets.fromLTRB(14.w, 0, 14.w, 14.h),
        child: Container(
          height: 66.h,
          padding: EdgeInsets.symmetric(horizontal: 14.w),
          decoration: BoxDecoration(
            color: AppColors.white,
            borderRadius: BorderRadius.circular(16.r),
            boxShadow: [
              BoxShadow(
                color: Colors.black.withOpacity(0.2),
                blurRadius: 18,
                offset: const Offset(0, 8),
              ),
            ],
          ),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: List.generate(items.length, (index) {
              final isSelected = index == currentIndex;
              final item = items[index];

              return GestureDetector(
                behavior: HitTestBehavior.opaque,
                onTap: () => _onTap(index),
                child: AnimatedContainer(
                  duration: const Duration(milliseconds: 220),
                  curve: Curves.easeOut,
                  height: 48.h,
                  padding: EdgeInsets.symmetric(
                    horizontal: isSelected ? 16.w : 10.w,
                  ),
                  decoration: BoxDecoration(
                    color: isSelected
                        ? AppColors.primaryColor
                        : Colors.transparent,
                    borderRadius: BorderRadius.circular(26.r),
                  ),
                  child: Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Image.asset(
                        item.icon,
                        width: 23.w,
                        height: 23.w,
                        color: isSelected
                            ? AppColors.white
                            : AppColors.primaryColor.withOpacity(0.9),
                      ),
                      if (isSelected) ...[
                        SizedBox(width: 6.w),
                        Text(
                          item.label,
                          maxLines: 1,
                          overflow: TextOverflow.fade,
                          style: TextStyle(
                            fontSize: 12.sp,
                            fontWeight: FontWeight.w600,
                            color: AppColors.white,
                          ),
                        ),
                      ],
                    ],
                  ),
                ),
              );
            }),
          ),
        ),
      ),
    );
  }
}

class _NavItem {
  final String icon;
  final String label;

  const _NavItem(this.icon, this.label);
}
