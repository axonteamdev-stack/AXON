import 'package:Axon/core/style/app_text_styles.dart';
import 'package:Axon/core/style/colors.dart';
import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';

class CustomTextField extends StatefulWidget {
  const CustomTextField({
    super.key,
    required this.controller,
    this.hintText,
    this.validator,
    this.onChanged,
    this.prefixIcon,
    this.isPassword = false,
    this.keyboardType,
    this.enabled,
    this.maxLines,
  });

  final TextEditingController controller;
  final int? maxLines;
  final String? hintText;
  final String? Function(String?)? validator;
  final Function(String)? onChanged;
  final Widget? prefixIcon;
  final bool isPassword;
  final TextInputType? keyboardType;
  final bool? enabled;

  @override
  State<CustomTextField> createState() => _CustomTextFieldState();
}

class _CustomTextFieldState extends State<CustomTextField> {
  bool _obscure = false;

  @override
  void initState() {
    super.initState();
    _obscure = widget.isPassword;
  }

  @override
  Widget build(BuildContext context) {
    final isEnabled = widget.enabled ?? true;

    return TextFormField(
      controller: widget.controller,
      maxLines: widget.maxLines ?? 1,
      validator: widget.validator,
      onChanged: isEnabled ? widget.onChanged : null,
      obscureText: widget.isPassword ? _obscure : false,
      keyboardType: widget.keyboardType,
      cursorColor: AppColors.primaryColor,
      enabled: isEnabled,
      textAlign: TextAlign.start,
      style: TextStyle(
        fontSize: 14.sp,
        fontFamily: AppTextStyles.regular.fontFamily,
        color: isEnabled ? AppColors.black : Colors.grey.shade700,
      ),
      decoration: InputDecoration(
        contentPadding:
            EdgeInsets.symmetric(vertical: 16.h, horizontal: 12.w),
        prefixIcon: widget.prefixIcon != null
            ? Padding(
                padding: EdgeInsets.symmetric(horizontal: 10.w),
                child: SizedBox(
                  width: 16.w,
                  height: 16.h,
                  child: widget.prefixIcon,
                ),
              )
            : null,
        prefixIconConstraints:
            BoxConstraints(minWidth: 40.w, minHeight: 40.h),
        suffixIcon: widget.isPassword && isEnabled
            ? IconButton(
                icon: Icon(
                  _obscure ? Icons.visibility_off : Icons.visibility,
                  color: Colors.grey.shade600,
                ),
                onPressed: () {
                  setState(() => _obscure = !_obscure);
                },
              )
            : null,
        hintText: widget.hintText,
        hintStyle:
            TextStyle(fontSize: 14.sp, color: Colors.grey.shade500),
        filled: true,
        fillColor:
            isEnabled ? AppColors.white : const Color(0xFFF5F6F8),
        enabledBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12.r),
          borderSide: const BorderSide(
            color: Color(0xFFDCE1E6),
            width: 1.2,
          ),
        ),
        focusedBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12.r),
          borderSide: BorderSide(
            color: AppColors.primaryColor,
            width: 1.4,
          ),
        ),
        disabledBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12.r),
          borderSide: const BorderSide(
            color: Color(0xFFE3E6EA),
            width: 1.2,
          ),
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
    );
  }
}
