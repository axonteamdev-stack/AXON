import 'package:Axon/core/style/colors.dart';
import 'package:Axon/core/widgets/text_app.dart';
import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';

class SelectableItemGrid extends StatelessWidget {
  final List<String> items;
  final List<String> selectedItems;
  final Function(String item) onSelect;
  final Color selectedColor;
  final Color borderColor;

  const SelectableItemGrid({
    super.key,
    required this.items,
    required this.selectedItems,
    required this.onSelect,
    this.selectedColor = AppColors.blue,
    this.borderColor = AppColors.grey,
  });

  @override
  Widget build(BuildContext context) {
    return GridView.builder(
      shrinkWrap: true,
      physics: const NeverScrollableScrollPhysics(),
      itemCount: items.length,
      gridDelegate: SliverGridDelegateWithFixedCrossAxisCount(
        crossAxisCount: 2,
        crossAxisSpacing: 12.w,
        mainAxisSpacing: 12.h,
        childAspectRatio: 5,
      ),
      itemBuilder: (context, index) {
        final item = items[index];
        final isSelected = selectedItems.contains(item);

        return GestureDetector(
          onTap: () => onSelect(item),
          child: Container(
            alignment: Alignment.center,
            padding: EdgeInsets.symmetric(horizontal: 8.w),
            decoration: BoxDecoration(
              borderRadius: BorderRadius.circular(12),
              color: isSelected ? selectedColor : AppColors.white,
              border: Border.all(
                color: isSelected ? selectedColor : borderColor,
              ),
            ),
            child: TextApp(
              text: item,
              color: isSelected ? AppColors.white : Colors.black87,
              fontSize: 14.sp,
              textAlign: TextAlign.center,
            ),
          ),
        );
      },
    );
  }
}
