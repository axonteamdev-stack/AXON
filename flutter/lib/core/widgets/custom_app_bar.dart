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

  const CustomAppBar({
    super.key,
    required this.title,
    this.showBack = true,
    this.onBack,
    this.backgroundColor,
    this.titleColor,
    this.height = 70,
    this.leading,
    this.trailing,
    this.fontSize,
    this.fontWeight = AppTextWeight.bold,
  });

  @override
  Widget build(BuildContext context) {
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
      ),
    );
  }

  @override
  Size get preferredSize => Size(double.infinity, height.h);
}
