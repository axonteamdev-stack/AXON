import 'package:Axon/core/extensions/localization_ext.dart';
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
          child: Text(
            context.l10n.agree_terms,
            style: TextStyle(
              color: Colors.black87,
              fontSize: 12.sp,
            ),
          ),
        ),
      ],
    );
  }
}
