<<<<<<< HEAD
=======
import 'package:Axon/core/extensions/localization_ext.dart';
>>>>>>> 0dd14dd95286373c6535852ed9ea6f14b97cafeb
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
<<<<<<< HEAD

          activeColor: AppColors.primaryColor,

          checkColor: Colors.white,

=======
          activeColor: AppColors.primaryColor,
          checkColor: Colors.white,
>>>>>>> 0dd14dd95286373c6535852ed9ea6f14b97cafeb
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(4.r),
          ),
        ),

        Expanded(
<<<<<<< HEAD
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
=======
          child: Text(
            context.l10n.agree_terms,
            style: TextStyle(
              color: Colors.black87,
              fontSize: 12.sp,
>>>>>>> 0dd14dd95286373c6535852ed9ea6f14b97cafeb
            ),
          ),
        ),
      ],
    );
  }
}
