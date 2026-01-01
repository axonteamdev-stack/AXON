import 'package:Axon/core/style/colors.dart';
import 'package:Axon/core/widgets/text_app.dart';
import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';

class ReusableDropdown extends StatelessWidget {
  final String? value;
  final List<String> items;
  final String hint;
  final Function(String?)? onChanged;

  const ReusableDropdown({
    super.key,
    required this.items,
    required this.hint,
    this.value,
    this.onChanged,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      width: double.infinity,
      padding: EdgeInsets.symmetric(horizontal: 12.w),
      decoration: BoxDecoration(
        border: Border.all(color: Colors.grey.shade300),
        borderRadius: BorderRadius.circular(10),
      ),
      child: DropdownButtonHideUnderline(
        child: DropdownButton<String>(
          value: value,
          isExpanded: true,
          dropdownColor: AppColors.white,

          hint: TextApp(
            text: hint,
            fontSize: 13.sp,
            weight: AppTextWeight.regular,
            color: AppColors.grey,
          ),

          items: items
              .map(
                (item) => DropdownMenuItem(
                  value: item,
                  child: TextApp(
                    text: item,
                    fontSize: 15.sp,
                    weight: AppTextWeight.regular,
                    color: AppColors.black,
                  ),
                ),
              )
              .toList(),

          onChanged: onChanged,
        ),
      ),
    );
  }
}
