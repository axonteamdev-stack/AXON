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
    _NavItem(AppImages.book, 'Books'),
    _NavItem(AppImages.post, 'Posts'),
    _NavItem(AppImages.ai, 'AI Chat'),
  ];

  @override
  Widget build(BuildContext context) {
    return SafeArea(
      top: false,
      child: Padding(
        padding: EdgeInsets.fromLTRB(16.w, 0, 16.w, 16.h),
        child: Container(
          height: 70.h,
          padding: EdgeInsets.symmetric(horizontal: 10.w),
          decoration: BoxDecoration(
            color: AppColors.white,
            borderRadius: BorderRadius.circular(36.r),
            boxShadow: [
              BoxShadow(
                color: Colors.black.withOpacity(.06),
                blurRadius: 20,
                offset: const Offset(0, 6),
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
                onTap: () {
                  setState(() => currentIndex = index);
                },
                child: AnimatedContainer(
                  duration: const Duration(milliseconds: 250),
                  curve: Curves.easeOut,
                  height: 52.h,
                  padding: EdgeInsets.symmetric(
                    horizontal: isSelected ? 18.w : 12.w,
                  ),
                  decoration: BoxDecoration(
                    color: isSelected
                        ? AppColors.primaryColor
                        : Colors.transparent,
                    borderRadius: BorderRadius.circular(28.r),
                  ),
                  child: Row(
                    mainAxisSize: MainAxisSize.min, // 🔑 مهم جدًا
                    children: [
                      Image.asset(
                        item.icon,
                        width: 22.w,
                        height: 22.w,
                        color: isSelected
                            ? AppColors.white
                            : AppColors.grey,
                      ),
                      if (isSelected) ...[
                        SizedBox(width: 8.w),
                        Text(
                          item.label,
                          maxLines: 1,
                          overflow: TextOverflow.fade,
                          style: const TextStyle(
                            fontSize: 14,
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
