import 'package:Axon/core/style/colors.dart';
import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';

class TermsCheckbox extends StatelessWidget {
  const TermsCheckbox({
    super.key,
    required this.checked,
    required this.onChanged,
  });

  final bool checked;
  final Function(bool) onChanged;

  @override
  Widget build(BuildContext context) {
    return Row(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Checkbox(
          value: checked,
          onChanged: (value) => onChanged(value ?? false),

          activeColor: AppColors.primaryColor,

          checkColor: Colors.white,

          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(4.r),
          ),
        ),

        Expanded(
          child: RichText(
            text: TextSpan(
              children: [
                TextSpan(
                  text: "I agree to the meddiodoc ",
                  style: TextStyle(color: Colors.black87, fontSize: 12.sp),
                ),
                TextSpan(
                  text: "Terms of Service",
                  style: TextStyle(
                    color: AppColors.primaryColor,
                    fontSize: 12.sp,
                  ),
                ),
                TextSpan(
                  text: " and ",
                  style: TextStyle(color: Colors.black87, fontSize: 12.sp),
                ),
                TextSpan(
                  text: "Privacy Policy",
                  style: TextStyle(
                    color: AppColors.primaryColor,
                    fontSize: 12.sp,
                  ),
                ),
              ],
            ),
          ),
        ),
      ],
    );
  }
}
