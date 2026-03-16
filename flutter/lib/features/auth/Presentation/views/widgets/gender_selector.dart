import 'package:Axon/core/style/colors.dart';
import 'package:Axon/core/widgets/text_app.dart';
import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';

class GenderSelector extends StatelessWidget {
  const GenderSelector({
    super.key,
    required this.selected,
    required this.onSelect,
  });

  final int selected;
  final Function(int) onSelect;

  @override
  Widget build(BuildContext context) {
    return Row(
      children: [
        _item("Male", 0),
        SizedBox(width: 12.w),
        _item("Female", 1),
      ],
    );
  }

  Widget _item(String text, int index) {
    final bool isActive = index == selected;

    return Expanded(
      child: GestureDetector(
        onTap: () => onSelect(index),
        child: Container(
          padding: EdgeInsets.symmetric(vertical: 12.h),
          decoration: BoxDecoration(
            borderRadius: BorderRadius.circular(8.r),
            border: Border.all(
              color: isActive ? Colors.blue : Colors.grey.shade300,
              width: 1.3,
            ),
            color: isActive ? AppColors.primaryColor : Colors.white,
          ),
          child: Center(
            child: TextApp(
              text: text,
              weight: isActive ? AppTextWeight.semiBold : AppTextWeight.regular,
              color: isActive ? AppColors.white : AppColors.black,
            ),
          ),
        ),
      ),
    );
  }
}
