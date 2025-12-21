import 'package:Axon/core/style/colors.dart';
import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';

import 'text_app.dart';

enum ButtonTextWeight { bold, regular }

class CustomButton extends StatelessWidget {
  const CustomButton({
    super.key,
    required this.onPressed,
    required this.text,
    this.width,
    this.height,
    this.borderRadius,
    this.color,
    this.textColor,
    this.textAlign,
    this.isLoading = false,
    this.loadingWidth = 24,
    this.loadingHeight = 24,
    this.fontSize,
    this.fontWeight = ButtonTextWeight.bold,
    this.border,
    this.elevation,
    this.icon,
    this.padding,
    this.child,
    this.shadowColor,
  });

  final VoidCallback? onPressed;
  final String text;

  final double? width;
  final double? height;
  final double? borderRadius;

  final Color? color;
  final Color? textColor;
  final Color? shadowColor;

  final TextAlign? textAlign;

  final bool isLoading;
  final double loadingWidth;
  final double loadingHeight;

  /// ✅ التحكم في حجم الخط
  final double? fontSize;
  final ButtonTextWeight fontWeight;

  final BorderSide? border;
  final double? elevation;
  final Widget? icon;
  final EdgeInsetsGeometry? padding;
  final Widget? child;

  @override
  Widget build(BuildContext context) {
    return Container(
      width: width ?? double.infinity,
      height: height ?? 50.h,
      decoration: BoxDecoration(
        color: color ?? AppColors.primaryColor,
        borderRadius: BorderRadius.circular(borderRadius ?? 12.r),
        border: border != null ? Border.fromBorderSide(border!) : null,
        boxShadow: shadowColor != null
            ? [
                BoxShadow(
                  color: shadowColor!,
                  offset: const Offset(0, 4),
                  blurRadius: 4,
                ),
              ]
            : null,
      ),
      child: Material(
        color: Colors.transparent,
        borderRadius: BorderRadius.circular(borderRadius ?? 12.r),
        child: InkWell(
          borderRadius: BorderRadius.circular(borderRadius ?? 12.r),
          onTap: isLoading ? null : onPressed,
          child: Padding(
            padding: padding ?? EdgeInsets.symmetric(horizontal: 12.w),
            child: Center(
              child: isLoading
                  ? SizedBox(
                      width: loadingWidth,
                      height: loadingHeight,
                      child: const CircularProgressIndicator(
                        strokeWidth: 2,
                        color: AppColors.white,
                      ),
                    )
                  : child ??
                      Row(
                        mainAxisSize: MainAxisSize.min,
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          if (icon != null) ...[
                            icon!,
                            SizedBox(width: 8.w),
                          ],
                          TextApp(
                            text: text,
                            fontSize: fontSize ?? 16.sp,
                            color: textColor ?? AppColors.white,
                            textAlign: textAlign ?? TextAlign.center,
                            weight: fontWeight == ButtonTextWeight.bold
                                ? AppTextWeight.bold
                                : AppTextWeight.regular,
                            overflow: TextOverflow.visible,
                            softWrap: false,
                          ),
                        ],
                      ),
            ),
          ),
        ),
      ),
    );
  }
}
