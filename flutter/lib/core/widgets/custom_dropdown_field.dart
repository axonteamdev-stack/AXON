import 'package:Axon/core/style/app_text_styles.dart';
import 'package:Axon/core/style/colors.dart';
import 'package:Axon/core/widgets/text_app.dart';
import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';

class CustomDropdownField extends StatelessWidget {
  final TextEditingController controller;
  final String? hintText;
  final List<String> items;
  final bool enabled;
  final Widget? prefixIcon;

  const CustomDropdownField({
    super.key,
    required this.controller,
    required this.items,
    this.hintText,
    this.enabled = true,
    this.prefixIcon,
  });

  @override
  Widget build(BuildContext context) {
    return DropdownButtonFormField<String>(
      value: controller.text.isEmpty ? null : controller.text,
      onChanged: enabled
          ? (value) {
              if (value != null) {
                controller.text = value;
              }
            }
          : null,
      dropdownColor: AppColors.white,
      menuMaxHeight: 220.h,
      icon: Icon(
        Icons.keyboard_arrow_down_rounded,
        color: AppColors.primaryColor,
      ),
      style: TextStyle(
        fontSize: 14.sp,
        fontFamily: AppTextStyles.regular.fontFamily,
        color: AppColors.black,
      ),
      decoration: InputDecoration(
        contentPadding: EdgeInsetsDirectional.symmetric(
          vertical: 16.h,
          horizontal: 12.w,
        ),
        prefixIcon: prefixIcon != null
            ? Padding(
                padding: EdgeInsetsDirectional.only(
                  start: 10.w,
                  end: 4.w,
                ),
                child: SizedBox(
                  width: 16.w,
                  height: 16.h,
                  child: prefixIcon,
                ),
              )
            : null,
        prefixIconConstraints:
            BoxConstraints(minWidth: 40.w, minHeight: 40.h),
        hintText: hintText,
        hintStyle:
            TextStyle(fontSize: 14.sp, color: Colors.grey.shade500),
        filled: true,
        fillColor: enabled ? AppColors.white : const Color(0xFFF5F6F8),
        enabledBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12.r),
          borderSide:
              const BorderSide(color: Color(0xFFDCE1E6), width: 1.2),
        ),
        focusedBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12.r),
          borderSide:
              BorderSide(color: AppColors.primaryColor, width: 1.4),
        ),
        disabledBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12.r),
          borderSide:
              const BorderSide(color: Color(0xFFE3E6EA), width: 1.2),
        ),
        errorBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12.r),
          borderSide:
              const BorderSide(color: Colors.red, width: 1.2),
        ),
        focusedErrorBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12.r),
          borderSide:
              const BorderSide(color: Colors.red, width: 1.4),
        ),
      ),
      items: items
          .map(
            (item) => DropdownMenuItem<String>(
              value: item,
              child: TextApp(
                text: item,
                fontSize: 14,
                textAlign: TextAlign.start,
              ),
            ),
          )
          .toList(),
    );
  }
}
