import 'package:Axon/core/extensions/context_extension.dart';
import 'package:Axon/core/style/colors.dart';
import 'package:Axon/core/widgets/text_app.dart';
import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';

class CustomAppBar extends StatelessWidget {
  final String? title;
  final Widget? titleWidget;
  final AlignmentGeometry? titleAlignment;

  final Widget? leading;
  final bool showBackButton;

  final Widget? trailing;
  final VoidCallback? onTrailingTap;

  /// Widget اختيارية تظهر أسفل العنوان
  final Widget? bottom;

  /// ارتفاع الـ AppBar
  final double? height;

  final EdgeInsetsGeometry? padding;

  final Color? backgroundColor;
  final Gradient? gradient;

  final bool showBackgroundCircles;
  final bool showShadow;

  final BorderRadiusGeometry? borderRadius;

  const CustomAppBar({
    super.key,
    this.title,
    this.titleWidget,
    this.titleAlignment,
    this.leading,
    this.showBackButton = true,
    this.trailing,
    this.onTrailingTap,
    this.bottom,
    this.height,
    this.padding,
    this.backgroundColor,
    this.gradient,
    this.showBackgroundCircles = true,
    this.showShadow = true,
    this.borderRadius,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      height: height ?? 120.h, // 👈 هنا تقدر تتحكم في الارتفاع
      width: double.infinity,
      decoration: BoxDecoration(
        color: gradient == null
            ? backgroundColor ?? AppColors.primaryColor
            : null,
        gradient:
            gradient ??
            const LinearGradient(
              begin: Alignment.topLeft,
              end: Alignment.bottomRight,
              colors: [Color(0xFF0D5BC7), Color(0xFF4DA2FF)],
            ),
        borderRadius:
            borderRadius ??
            BorderRadius.only(
              bottomLeft: Radius.circular(28.r),
              bottomRight: Radius.circular(28.r),
            ),
        boxShadow: showShadow
            ? [
                BoxShadow(
                  color: const Color(0xFF0D5BC7).withOpacity(.25),
                  blurRadius: 20,
                  offset: const Offset(0, 8),
                ),
              ]
            : null,
      ),
      child: Stack(
        children: [
          if (showBackgroundCircles) ...[
            Positioned(
              right: -40,
              top: -30,
              child: Container(
                width: 180.w,
                height: 180.w,
                decoration: BoxDecoration(
                  shape: BoxShape.circle,
                  color: Colors.white.withOpacity(.08),
                ),
              ),
            ),
            Positioned(
              right: 80.w,
              top: 10.h,
              child: Container(
                width: 90.w,
                height: 90.w,
                decoration: BoxDecoration(
                  shape: BoxShape.circle,
                  color: Colors.white.withOpacity(.08),
                ),
              ),
            ),
            Positioned(
              left: -30.w,
              bottom: -50.h,
              child: Container(
                width: 120.w,
                height: 120.w,
                decoration: BoxDecoration(
                  shape: BoxShape.circle,
                  color: Colors.white.withOpacity(.08),
                ),
              ),
            ),
          ],

          SafeArea(
            child: Padding(
              padding:
                  padding ??
                  EdgeInsets.symmetric(horizontal: 16.w, vertical: 16.h),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      if (leading != null)
                        leading!
                      else if (showBackButton)
                        Container(
                          width: 44.w,
                          height: 44.h,
                          decoration: BoxDecoration(
                            color: Colors.white.withOpacity(.15),
                            borderRadius: BorderRadius.circular(14.r),
                            border: Border.all(
                              color: Colors.white.withOpacity(.15),
                            ),
                          ),
                          child: IconButton(
                            onPressed: () => context.pop(),
                            icon: const Icon(
                              Icons.arrow_back_ios_new,
                              color: Colors.white,
                              size: 18,
                            ),
                          ),
                        ),

                      if (showBackButton || leading != null)
                        SizedBox(width: 12.w),

                      Expanded(
                        child: Align(
                          alignment: titleAlignment ?? Alignment.centerLeft,
                          child:
                              titleWidget ??
                              TextApp(
                                text: title ?? "",
                                color: Colors.white,
                                fontSize: 22.sp,
                                weight: AppTextWeight.bold,
                              ),
                        ),
                      ),

                      if (trailing != null)
                        GestureDetector(onTap: onTrailingTap, child: trailing!),
                    ],
                  ),

                  if (bottom != null) ...[SizedBox(height: 16.h), bottom!],
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
}
