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
<<<<<<< HEAD
    this.shadowColor,
  });

  final dynamic onPressed;
  final String text;
  final double? width;
  final double? height;
  final double? borderRadius;
  final Color? color;
  final Color? textColor;
  final TextAlign? textAlign;
  final bool isLoading;
  final double loadingWidth;
  final double loadingHeight;
  final double? fontSize;
  final ButtonTextWeight fontWeight;
=======
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

>>>>>>> 0dd14dd95286373c6535852ed9ea6f14b97cafeb
  final BorderSide? border;
  final double? elevation;
  final Widget? icon;
  final EdgeInsetsGeometry? padding;
  final Widget? child;
<<<<<<< HEAD
  final Color? shadowColor;
=======
>>>>>>> 0dd14dd95286373c6535852ed9ea6f14b97cafeb

  @override
  Widget build(BuildContext context) {
    return Container(
      width: width ?? double.infinity,
      height: height ?? 50.h,
      decoration: BoxDecoration(
        color: color ?? AppColors.primaryColor,
<<<<<<< HEAD
        borderRadius: BorderRadius.circular(borderRadius ?? 12),
        boxShadow: [
          if (shadowColor != null)
            BoxShadow(
              color: shadowColor!,
              offset: const Offset(0, 4),
              blurRadius: 4,
            ),
        ],
      ),
      child: Material(
        color: Colors.transparent,
        borderRadius: BorderRadius.circular(borderRadius ?? 12),
        child: InkWell(
          borderRadius: BorderRadius.circular(borderRadius ?? 12),
          onTap: isLoading
              ? null
              : () {
                  if (onPressed != null) {
                    var result = onPressed();
                    if (result is Future) {
                      result.catchError((e) {});
                    }
                  }
                },
          child: Align(
            alignment: Alignment.center,
            child: isLoading
                ? SizedBox(
                    width: loadingWidth,
                    height: loadingHeight,
                    child: const CircularProgressIndicator(
                      color: AppColors.white,
                      strokeWidth: 2,
                    ),
                  )
                : child ??
                      Row(
                        mainAxisAlignment: MainAxisAlignment.center,
                        crossAxisAlignment: CrossAxisAlignment.center,
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          if (icon != null) ...[icon!, SizedBox(width: 8.w)],
                          TextApp(
                            text: text,
                            weight: fontWeight == ButtonTextWeight.bold
                                ? AppTextWeight.bold
                                : AppTextWeight.regular,
                            color: textColor ?? AppColors.white,
                            fontSize: fontSize ?? 16.sp,
                            textAlign: textAlign ?? TextAlign.center,
=======
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
>>>>>>> 0dd14dd95286373c6535852ed9ea6f14b97cafeb
                            overflow: TextOverflow.visible,
                            softWrap: false,
                          ),
                        ],
                      ),
<<<<<<< HEAD
=======
            ),
>>>>>>> 0dd14dd95286373c6535852ed9ea6f14b97cafeb
          ),
        ),
      ),
    );
  }
}
