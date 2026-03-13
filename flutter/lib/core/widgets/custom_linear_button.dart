import 'package:Axon/core/style/colors.dart';
import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';

class CustomLinearButton extends StatelessWidget {
  const CustomLinearButton({
    Key? key,
    required this.onPressed,
    required this.child,
    this.height,
    this.width,
    this.borderRadius,
    this.gradient,
    this.color,
    this.border,
    this.splashColor,
    this.padding,
  }) : super(key: key);

  final VoidCallback onPressed;
  final Widget child;
  final double? height;
  final double? width;
  final BorderRadiusGeometry? borderRadius;
  final Gradient? gradient;
  final Color? color;
  final BoxBorder? border;
  final Color? splashColor;
  final EdgeInsetsGeometry? padding;

  @override
  Widget build(BuildContext context) {
    final BorderRadius effectiveRadius = borderRadius is BorderRadius
        ? borderRadius as BorderRadius
        : BorderRadius.circular(10);
    return InkWell(
      onTap: onPressed,
      splashColor: splashColor ?? Colors.white.withOpacity(0.2),
      borderRadius: effectiveRadius,
      child: Container(
        height: height ?? 44.h,
        width: width ?? double.infinity,
        padding: padding ?? EdgeInsets.symmetric(horizontal: 16.w),
        decoration: BoxDecoration(
          borderRadius: borderRadius ?? BorderRadius.circular(10),
          gradient: gradient,
          color: gradient == null ? (color ?? AppColors.primaryColor) : null,
          border: border,
        ),
        child: Center(child: child),
      ),
    );
  }
}
