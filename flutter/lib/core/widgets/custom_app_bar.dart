<<<<<<< HEAD
import 'package:Axon/core/extensions/context_extension.dart';
import 'package:Axon/core/style/app_images.dart';
import 'package:Axon/core/style/colors.dart';
import 'package:Axon/core/widgets/custom_linear_button.dart';
import 'package:Axon/core/widgets/text_app.dart';
import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:flutter_svg/flutter_svg.dart';

class CustomAppBar extends StatelessWidget implements PreferredSizeWidget {
  final String title;
  final bool showBack;
  final VoidCallback? onBack;
  final Color? backgroundColor;
  final Color? titleColor;
  final double height;
  final Widget? leading;
  final Widget? trailing;
  final double? fontSize;
  final AppTextWeight fontWeight;
=======
import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:Axon/core/style/colors.dart';
import 'package:Axon/core/widgets/text_app.dart';
import 'package:Axon/core/extensions/context_extension.dart';

class CustomAppBar extends StatelessWidget {
  final String title;

  final Widget? trailing;
  final VoidCallback? onTrailingTap;
>>>>>>> 0dd14dd95286373c6535852ed9ea6f14b97cafeb

  const CustomAppBar({
    super.key,
    required this.title,
<<<<<<< HEAD
    this.showBack = true,
    this.onBack,
    this.backgroundColor,
    this.titleColor,
    this.height = 70,
    this.leading,
    this.trailing,
    this.fontSize,
    this.fontWeight = AppTextWeight.bold,
=======
    this.trailing,
    this.onTrailingTap,
>>>>>>> 0dd14dd95286373c6535852ed9ea6f14b97cafeb
  });

  @override
  Widget build(BuildContext context) {
<<<<<<< HEAD
    return AppBar(
      automaticallyImplyLeading: false,
      backgroundColor: backgroundColor ?? AppColors.white,
      elevation: 0,
      centerTitle: true,
      surfaceTintColor: Colors.transparent,
      title: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          leading ??
              (showBack
                  ? CustomLinearButton(
                      onPressed: onBack ?? () => context.pop(),
                      child: Center(child: SvgPicture.asset(AppImages.logoApp)),
                    )
                  : const SizedBox(width: 50)),
          Flexible(
            child: TextApp(
              text: title,
              weight: fontWeight,
              color: titleColor ?? AppColors.black,
              fontSize: fontSize ?? 20.sp,
              textAlign: TextAlign.center,
              overflow: TextOverflow.ellipsis,
            ),
          ),
          trailing ?? const SizedBox(width: 50),
        ],
=======
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
          children: [
            IconButton(
              icon: const Icon(
                Icons.arrow_back_ios,
                color: AppColors.white,
                size: 22,
              ),
              onPressed: () => context.pop(),
            ),

            TextApp(
              text: title,
              color: AppColors.white,
              fontSize: 18,
              weight: AppTextWeight.bold,
            ),

            const Spacer(),

            if (trailing != null)
              GestureDetector(
                onTap: onTrailingTap,
                child: trailing,
              ),
          ],
        ),
>>>>>>> 0dd14dd95286373c6535852ed9ea6f14b97cafeb
      ),
    );
  }

<<<<<<< HEAD
  @override
  Size get preferredSize => Size(double.infinity, height.h);
=======
>>>>>>> 0dd14dd95286373c6535852ed9ea6f14b97cafeb
}
