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
<<<<<<< HEAD
    this.readOnly = false,
  });

  final TextEditingController controller;
=======
    this.enabled,
    this.maxLines,
  });

  final TextEditingController controller;
  final int? maxLines;
>>>>>>> 0dd14dd95286373c6535852ed9ea6f14b97cafeb
  final String? hintText;
  final String? Function(String?)? validator;
  final Function(String)? onChanged;
  final Widget? prefixIcon;
  final bool isPassword;
  final TextInputType? keyboardType;
<<<<<<< HEAD
  final bool readOnly;
=======
  final bool? enabled;
>>>>>>> 0dd14dd95286373c6535852ed9ea6f14b97cafeb

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
<<<<<<< HEAD
    return TextFormField(
      controller: widget.controller,
      validator: widget.validator,
      onChanged: widget.onChanged,
      readOnly: widget.readOnly,
      obscureText: _obscure,
      keyboardType: widget.keyboardType,
      cursorColor: AppColors.primaryColor,

      style: TextStyle(
        fontSize: 14.sp,
        fontFamily: AppTextStyles.regular.fontFamily,
        color: AppColors.black,
      ),

      decoration: InputDecoration(
        contentPadding: EdgeInsets.symmetric(vertical: 16.h, horizontal: 12.w),

        prefixIcon: widget.prefixIcon != null
            ? Padding(
                padding: EdgeInsets.only(left: 10.w, right: 4.w),
=======
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
>>>>>>> 0dd14dd95286373c6535852ed9ea6f14b97cafeb
                child: SizedBox(
                  width: 16.w,
                  height: 16.h,
                  child: widget.prefixIcon,
                ),
              )
            : null,
<<<<<<< HEAD

        prefixIconConstraints: BoxConstraints(minWidth: 28.w, minHeight: 28.h),

        suffixIcon: widget.isPassword
=======
        prefixIconConstraints:
            BoxConstraints(minWidth: 40.w, minHeight: 40.h),
        suffixIcon: widget.isPassword && isEnabled
>>>>>>> 0dd14dd95286373c6535852ed9ea6f14b97cafeb
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
<<<<<<< HEAD

        hintText: widget.hintText,
        hintStyle: TextStyle(fontSize: 14.sp, color: Colors.grey.shade500),

        filled: true,
        fillColor: AppColors.white,

        enabledBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12.r),
          borderSide: const BorderSide(color: Color(0xFFDCE1E6), width: 1.2),
        ),

        focusedBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12.r),
          borderSide: BorderSide(color: AppColors.primaryColor, width: 1.4),
        ),

        errorBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12.r),
          borderSide: const BorderSide(color: Colors.red, width: 1.2),
        ),

        focusedErrorBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12.r),
          borderSide: const BorderSide(color: Colors.red, width: 1.4),
=======
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
>>>>>>> 0dd14dd95286373c6535852ed9ea6f14b97cafeb
        ),
      ),
    );
  }
}
