import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';

import 'package:Axon/core/style/colors.dart';
import 'package:Axon/core/widgets/text_app.dart';

class TabItem extends StatelessWidget {
  final String title;
  final bool selected;
  final int? count;
  final VoidCallback onTap;

  const TabItem({
    required this.title,
    required this.selected,
    required this.onTap,
    this.count,
  });

  @override
  Widget build(BuildContext context) {
    return Expanded(
      child: GestureDetector(
        onTap: onTap,
        child: Stack(
          clipBehavior: Clip.none,
          children: [
            Container(
              height: 44.h,
              alignment: Alignment.center,
              decoration: BoxDecoration(
                color: selected
                    ? AppColors.primaryColor
                    : const Color(0xFFF2F2F2),
                borderRadius: BorderRadius.circular(22.r),
              ),
              child: TextApp(
                text: title,
                weight: AppTextWeight.semiBold,
                color: selected
                    ? AppColors.white
                    : AppColors.black,
              ),
            ),
            if (count != null && count! > 0)
              Positioned(
                top: -6,
                right: -6,
                child: Container(
                  padding: EdgeInsets.symmetric(
                    horizontal: 6.w,
                    vertical: 2.h,
                  ),
                  decoration: const BoxDecoration(
                    color: AppColors.primaryColor,
                    shape: BoxShape.circle,
                  ),
                  child: Text(
                    count.toString(),
                    style: TextStyle(
                      color: AppColors.white,
                      fontSize: 10.sp,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ),
              ),
          ],
        ),
      ),
    );
  }
}
